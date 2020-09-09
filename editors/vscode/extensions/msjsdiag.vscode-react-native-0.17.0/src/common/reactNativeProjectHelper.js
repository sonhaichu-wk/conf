"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactNativeProjectHelper = void 0;
const Q = require("q");
const fs = require("fs");
const path = require("path");
const projectVersionHelper_1 = require("./projectVersionHelper");
class ReactNativeProjectHelper {
    /**
     * Ensures that we are in a React Native project
     * Otherwise, displays an error message banner
     */
    static isReactNativeProject(projectRoot) {
        if (!projectRoot || !fs.existsSync(path.join(projectRoot, "package.json"))) {
            return Q(false);
        }
        return projectVersionHelper_1.ProjectVersionHelper.getReactNativeVersions(projectRoot)
            .then(versions => {
            return !projectVersionHelper_1.ProjectVersionHelper.isVersionError(versions.reactNativeVersion);
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
}
exports.ReactNativeProjectHelper = ReactNativeProjectHelper;

//# sourceMappingURL=reactNativeProjectHelper.js.map
