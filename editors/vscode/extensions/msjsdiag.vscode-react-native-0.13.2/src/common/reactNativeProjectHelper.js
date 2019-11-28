"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
const Q = require("q");
const fs = require("fs");
const path = require("path");
const semver = require("semver");
const url_1 = require("url");
const package_1 = require("./node/package");
const errorHelper_1 = require("../common/error/errorHelper");
const internalErrorCode_1 = require("../common/error/internalErrorCode");
class ReactNativeProjectHelper {
    static getRNVersionsWithBrokenMetroBundler() {
        // https://github.com/Microsoft/vscode-react-native/issues/660 for details
        return ["0.54.0", "0.54.1", "0.54.2", "0.54.3", "0.54.4"];
    }
    static getReactNativeVersions(projectRoot, isRNWindows = false) {
        return ReactNativeProjectHelper.getReactNativePackageVersionsFromNodeModules(projectRoot, isRNWindows)
            .catch(err => {
            return ReactNativeProjectHelper.getReactNativeVersionsFromProjectPackage(projectRoot, isRNWindows);
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
            versionPromises.push(ReactNativeProjectHelper.getProcessedVersionFromNodeModules(projectRoot, parsedPackage));
        });
        return Q.all(versionPromises).then(packageVersionArray => {
            return packageVersionArray.reduce((allPackageVersions, packageVersion) => {
                return Object.assign(allPackageVersions, packageVersion);
            }, {});
        })
            .then(packageVersions => {
            if (!packageVersions["react-native"]) {
                throw errorHelper_1.ErrorHelper.getInternalError(internalErrorCode_1.InternalErrorCode.ReactNativePackageIsNotInstalled);
            }
            return {
                reactNativeVersion: packageVersions["react-native"],
                reactNativeWindowsVersion: packageVersions["react-native-windows"] || "",
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
                            parsedPackageVersions[parsedPackage.packageName] = ReactNativeProjectHelper.processVersion(dependencies[parsedPackage.packageName], parsedPackage.useSemverCoerce);
                        }
                        else if (devDependencies[parsedPackage.packageName]) {
                            parsedPackageVersions[parsedPackage.packageName] = ReactNativeProjectHelper.processVersion(devDependencies[parsedPackage.packageName], parsedPackage.useSemverCoerce);
                        }
                        else {
                            parsedPackageVersions[parsedPackage.packageName] = "";
                        }
                    }
                    catch (err) {
                        parsedPackageVersions[parsedPackage.packageName] = "";
                    }
                });
                return {
                    reactNativeVersion: parsedPackageVersions["react-native"],
                    reactNativeWindowsVersion: parsedPackageVersions["react-native-windows"] || "",
                };
            });
        })
            .catch(err => ({
            reactNativeVersion: "",
            reactNativeWindowsVersion: "",
        }));
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
    /**
     * Ensures that we are in a React Native project
     * Otherwise, displays an error message banner
     */
    static isReactNativeProject(projectRoot) {
        if (!projectRoot || !fs.existsSync(path.join(projectRoot, "package.json"))) {
            return Q(false);
        }
        return this.getReactNativeVersions(projectRoot)
            .then(versions => {
            return !!(versions.reactNativeVersion);
        });
    }
    static isHaulProject(projectRoot) {
        if (!projectRoot || !fs.existsSync(path.join(projectRoot, "package.json"))) {
            return false;
        }
        const packageJson = require(path.join(projectRoot, "package.json"));
        const haulVersion = packageJson.devDependencies && (packageJson.devDependencies.haul || packageJson.devDependencies["@haul-bundler/cli"]);
        return !!haulVersion;
    }
    static getProcessedVersionFromNodeModules(projectRoot, parsedPackage) {
        return new package_1.Package(projectRoot).getPackageVersionFromNodeModules(parsedPackage.packageName)
            .then(version => ({ [parsedPackage.packageName]: ReactNativeProjectHelper.processVersion(version, parsedPackage.useSemverCoerce) }))
            .catch(err => ({ [parsedPackage.packageName]: "" }));
    }
}
exports.ReactNativeProjectHelper = ReactNativeProjectHelper;

//# sourceMappingURL=reactNativeProjectHelper.js.map
