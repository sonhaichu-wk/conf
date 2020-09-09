"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlistBuddy = void 0;
const path = require("path");
const glob = require("glob");
const fs = require("fs");
const semver = require("semver");
const node_1 = require("../../common/node/node");
const errorHelper_1 = require("../../common/error/errorHelper");
const internalErrorCode_1 = require("../../common/error/internalErrorCode");
const projectVersionHelper_1 = require("../../common/projectVersionHelper");
const utils_1 = require("../../common/utils");
class PlistBuddy {
    constructor({ nodeChildProcess = new node_1.Node.ChildProcess(), } = {}) {
        this.TARGET_BUILD_DIR_SEARCH_KEY = "TARGET_BUILD_DIR";
        this.FULL_PRODUCT_NAME_SEARCH_KEY = "FULL_PRODUCT_NAME";
        this.nodeChildProcess = nodeChildProcess;
    }
    getBundleId(iosProjectRoot, projectRoot, simulator = true, configuration = "Debug", productName, scheme) {
        return projectVersionHelper_1.ProjectVersionHelper.getReactNativeVersions(projectRoot)
            .then((rnVersions) => {
            let productsFolder;
            if (semver.gte(rnVersions.reactNativeVersion, "0.59.0")) {
                if (!scheme) {
                    // If no scheme were provided via runOptions.scheme or via runArguments then try to get scheme using the way RN CLI does.
                    scheme = this.getInferredScheme(iosProjectRoot, projectRoot, rnVersions.reactNativeVersion);
                }
                productsFolder = path.join(iosProjectRoot, "build", scheme, "Build", "Products");
            }
            else {
                productsFolder = path.join(iosProjectRoot, "build", "Build", "Products");
            }
            const sdkType = simulator ? "iphonesimulator" : "iphoneos";
            let configurationFolder = path.join(productsFolder, `${configuration}-${sdkType}`);
            let executable = "";
            if (productName) {
                executable = `${productName}.app`;
                if (!fs.existsSync(path.join(configurationFolder, executable))) {
                    const configurationData = this.getConfigurationData(projectRoot, rnVersions.reactNativeVersion, iosProjectRoot, configuration, scheme, sdkType, configurationFolder);
                    configurationFolder = configurationData.configurationFolder;
                }
            }
            else {
                const executableList = this.findExecutable(configurationFolder);
                if (!executableList.length) {
                    const configurationData = this.getConfigurationData(projectRoot, rnVersions.reactNativeVersion, iosProjectRoot, configuration, scheme, sdkType, configurationFolder);
                    configurationFolder = configurationData.configurationFolder;
                    executableList.push(configurationData.fullProductName);
                }
                else if (executableList.length > 1) {
                    throw errorHelper_1.ErrorHelper.getInternalError(internalErrorCode_1.InternalErrorCode.IOSFoundMoreThanOneExecutablesCleanupBuildFolder, configurationFolder);
                }
                executable = `${executableList[0]}`;
            }
            const infoPlistPath = path.join(configurationFolder, executable, "Info.plist");
            return this.invokePlistBuddy("Print:CFBundleIdentifier", infoPlistPath);
        });
    }
    setPlistProperty(plistFile, property, value) {
        // Attempt to set the value, and if it fails due to the key not existing attempt to create the key
        return this.invokePlistBuddy(`Set ${property} ${value}`, plistFile).fail(() => this.invokePlistBuddy(`Add ${property} string ${value}`, plistFile)).then(() => { });
    }
    setPlistBooleanProperty(plistFile, property, value) {
        // Attempt to set the value, and if it fails due to the key not existing attempt to create the key
        return this.invokePlistBuddy(`Set ${property} ${value}`, plistFile)
            .fail(() => this.invokePlistBuddy(`Add ${property} bool ${value}`, plistFile))
            .then(() => { });
    }
    deletePlistProperty(plistFile, property) {
        return this.invokePlistBuddy(`Delete ${property}`, plistFile).then(() => { });
    }
    readPlistProperty(plistFile, property) {
        return this.invokePlistBuddy(`Print ${property}`, plistFile);
    }
    getBuildPathAndProductName(iosProjectRoot, projectWorkspaceConfigName, configuration, scheme, sdkType) {
        const buildSettings = this.nodeChildProcess.execFileSync("xcodebuild", [
            "-workspace",
            projectWorkspaceConfigName,
            "-scheme",
            scheme,
            "-sdk",
            sdkType,
            "-configuration",
            configuration,
            "-showBuildSettings",
        ], {
            encoding: "utf8",
            cwd: iosProjectRoot,
        });
        const targetBuildDir = this.fetchParameterFromBuildSettings(buildSettings, this.TARGET_BUILD_DIR_SEARCH_KEY);
        const fullProductName = this.fetchParameterFromBuildSettings(buildSettings, this.FULL_PRODUCT_NAME_SEARCH_KEY);
        if (!targetBuildDir) {
            throw new Error("Failed to get the target build directory.");
        }
        if (!fullProductName) {
            throw new Error("Failed to get full product name.");
        }
        return {
            fullProductName,
            configurationFolder: targetBuildDir,
        };
    }
    getInferredScheme(iosProjectRoot, projectRoot, rnVersion) {
        const projectWorkspaceConfigName = this.getProjectWorkspaceConfigName(iosProjectRoot, projectRoot, rnVersion);
        return utils_1.getFileNameWithoutExtension(projectWorkspaceConfigName);
    }
    getProjectWorkspaceConfigName(iosProjectRoot, projectRoot, rnVersion) {
        // Portion of code was taken from https://github.com/react-native-community/cli/blob/master/packages/platform-ios/src/commands/runIOS/index.js
        // and modified a little bit
        /**
         * Copyright (c) Facebook, Inc. and its affiliates.
         *
         * This source code is licensed under the MIT license found in the
         * LICENSE file in the root directory of this source tree.
         *
         * @flow
         * @format
         */
        let iOSCliFolderName;
        if (semver.gte(rnVersion, "0.60.0")) {
            iOSCliFolderName = "cli-platform-ios";
        }
        else {
            iOSCliFolderName = "cli";
        }
        const findXcodeProject = require(path.join(projectRoot, `node_modules/@react-native-community/${iOSCliFolderName}/build/commands/runIOS/findXcodeProject`)).default;
        const xcodeProject = findXcodeProject(fs.readdirSync(iosProjectRoot));
        if (!xcodeProject) {
            throw new Error(`Could not find Xcode project files in "${iosProjectRoot}" folder`);
        }
        return xcodeProject.name;
    }
    getConfigurationData(projectRoot, reactNativeVersion, iosProjectRoot, configuration, scheme, sdkType, oldConfigurationFolder) {
        if (!scheme) {
            throw errorHelper_1.ErrorHelper.getInternalError(internalErrorCode_1.InternalErrorCode.IOSCouldNotFoundExecutableInFolder, oldConfigurationFolder);
        }
        const projectWorkspaceConfigName = this.getProjectWorkspaceConfigName(iosProjectRoot, projectRoot, reactNativeVersion);
        return this.getBuildPathAndProductName(iosProjectRoot, projectWorkspaceConfigName, configuration, scheme, sdkType);
    }
    /**
     * @param {string} buildSettings
     * @param {string} parameterName
     * @returns {string | null}
     */
    fetchParameterFromBuildSettings(buildSettings, parameterName) {
        const targetBuildMatch = new RegExp(`${parameterName} = (.+)$`, "m").exec(buildSettings);
        return targetBuildMatch && targetBuildMatch[1]
            ? targetBuildMatch[1].trim()
            : null;
    }
    findExecutable(folder) {
        return glob.sync("*.app", {
            cwd: folder,
        });
    }
    invokePlistBuddy(command, plistFile) {
        return this.nodeChildProcess.exec(`${PlistBuddy.plistBuddyExecutable} -c '${command}' '${plistFile}'`).outcome.then((result) => {
            return result.toString().trim();
        });
    }
}
exports.PlistBuddy = PlistBuddy;
PlistBuddy.plistBuddyExecutable = "/usr/libexec/PlistBuddy";

//# sourceMappingURL=plistBuddy.js.map
