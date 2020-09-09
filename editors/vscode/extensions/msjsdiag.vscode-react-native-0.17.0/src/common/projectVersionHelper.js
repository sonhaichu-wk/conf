"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectVersionHelper = void 0;
const Q = require("q");
const semver = require("semver");
const url_1 = require("url");
const package_1 = require("./node/package");
const errorHelper_1 = require("../common/error/errorHelper");
const internalErrorCode_1 = require("../common/error/internalErrorCode");
const versionError_1 = require("./error/versionError");
class ProjectVersionHelper {
    static getRNVersionsWithBrokenMetroBundler() {
        // https://github.com/microsoft/vscode-react-native/issues/660 for details
        return ["0.54.0", "0.54.1", "0.54.2", "0.54.3", "0.54.4"];
    }
    static getReactNativeVersions(projectRoot, isRNWindows = false) {
        return ProjectVersionHelper.getReactNativePackageVersionsFromNodeModules(projectRoot, isRNWindows)
            .catch(err => {
            return ProjectVersionHelper.getReactNativeVersionsFromProjectPackage(projectRoot, isRNWindows);
        });
    }
    static getReactNativePackageVersionsFromNodeModules(projectRoot, isRNWindows = false) {
        let parsedPackages = [
            {
                packageName: "react-native",
                useSemverCoerce: true,
            },
        ];
        if (isRNWindows) {
            parsedPackages.push({
                packageName: "react-native-windows",
                useSemverCoerce: false,
            });
        }
        let versionPromises = [];
        parsedPackages.forEach(parsedPackage => {
            versionPromises.push(ProjectVersionHelper.getProcessedVersionFromNodeModules(projectRoot, parsedPackage));
        });
        return Q.all(versionPromises).then(packageVersionArray => {
            return packageVersionArray.reduce((allPackageVersions, packageVersion) => {
                return Object.assign(allPackageVersions, packageVersion);
            }, {});
        })
            .then(packageVersions => {
            if (ProjectVersionHelper.isVersionError(packageVersions["react-native"])) {
                throw errorHelper_1.ErrorHelper.getInternalError(internalErrorCode_1.InternalErrorCode.ReactNativePackageIsNotInstalled);
            }
            return {
                reactNativeVersion: packageVersions["react-native"],
                reactNativeWindowsVersion: packageVersions["react-native-windows"] || versionError_1.RN_VERSION_ERRORS.MISSING_PACKAGE_IN_NODE_MODULES,
            };
        });
    }
    static getReactNativeVersionsFromProjectPackage(cwd, isRNWindows = false) {
        let parsedPackages = [
            {
                packageName: "react-native",
                useSemverCoerce: true,
            },
        ];
        if (isRNWindows) {
            parsedPackages.push({
                packageName: "react-native-windows",
                useSemverCoerce: false,
            });
        }
        const rootProjectPackageJson = new package_1.Package(cwd);
        return rootProjectPackageJson.dependencies()
            .then(dependencies => {
            return rootProjectPackageJson.devDependencies()
                .then(devDependencies => {
                let parsedPackageVersions = {};
                parsedPackages.forEach(parsedPackage => {
                    try {
                        if (dependencies[parsedPackage.packageName]) {
                            parsedPackageVersions[parsedPackage.packageName] = ProjectVersionHelper.processVersion(dependencies[parsedPackage.packageName], parsedPackage.useSemverCoerce);
                        }
                        else if (devDependencies[parsedPackage.packageName]) {
                            parsedPackageVersions[parsedPackage.packageName] = ProjectVersionHelper.processVersion(devDependencies[parsedPackage.packageName], parsedPackage.useSemverCoerce);
                        }
                        else {
                            parsedPackageVersions[parsedPackage.packageName] = versionError_1.RN_VERSION_ERRORS.MISSING_DEPENDENCY_IN_PROJECT_PACKAGE_FILE;
                        }
                    }
                    catch (err) {
                        parsedPackageVersions[parsedPackage.packageName] = versionError_1.RN_VERSION_ERRORS.MISSING_DEPENDENCIES_FIELDS_IN_PROJECT_PACKAGE_FILE;
                    }
                });
                return {
                    reactNativeVersion: parsedPackageVersions["react-native"],
                    reactNativeWindowsVersion: parsedPackageVersions["react-native-windows"] || versionError_1.RN_VERSION_ERRORS.MISSING_PACKAGE_IN_NODE_MODULES,
                };
            });
        })
            .catch(err => ({
            reactNativeVersion: versionError_1.RN_VERSION_ERRORS.UNKNOWN_ERROR,
            reactNativeWindowsVersion: versionError_1.RN_VERSION_ERRORS.UNKNOWN_ERROR,
        }));
    }
    static isVersionError(version) {
        return version.toLowerCase().includes("error");
    }
    static processVersion(version, useSemverCoerce = true) {
        try {
            return new url_1.URL(version) && "SemverInvalid: URL";
        }
        catch (err) {
            let versionObj;
            // As some of 'react-native-windows' versions contain postfixes we cannot use 'coerce' function to parse them
            // as some critical parts of the version string will be dropped. To save this information we use 'clean' function
            if (useSemverCoerce) {
                versionObj = semver.coerce(version);
            }
            else {
                versionObj = semver.clean(version.replace(/[\^~<>]/g, ""), { loose: true });
            }
            return (versionObj && versionObj.toString()) || "SemverInvalid";
        }
    }
    static getProcessedVersionFromNodeModules(projectRoot, parsedPackage) {
        return new package_1.Package(projectRoot).getPackageVersionFromNodeModules(parsedPackage.packageName)
            .then(version => ({ [parsedPackage.packageName]: ProjectVersionHelper.processVersion(version, parsedPackage.useSemverCoerce) }))
            .catch(err => ({ [parsedPackage.packageName]: versionError_1.RN_VERSION_ERRORS.MISSING_PACKAGE_IN_NODE_MODULES }));
    }
}
exports.ProjectVersionHelper = ProjectVersionHelper;

//# sourceMappingURL=projectVersionHelper.js.map
