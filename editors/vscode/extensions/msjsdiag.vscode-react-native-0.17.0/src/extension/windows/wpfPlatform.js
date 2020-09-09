"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.WpfPlatform = void 0;
const Q = require("q");
const semver = require("semver");
const path = require("path");
const generalMobilePlatform_1 = require("../generalMobilePlatform");
const telemetryHelper_1 = require("../../common/telemetryHelper");
const commandExecutor_1 = require("../../common/commandExecutor");
const windowsPlatform_1 = require("./windowsPlatform");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
/**
 * WPF specific platform implementation for debugging RN applications.
 */
class WpfPlatform extends windowsPlatform_1.WindowsPlatform {
    constructor(runOptions, platformDeps = {}) {
        super(runOptions, platformDeps);
        this.runOptions = runOptions;
    }
    runApp(enableDebug = true) {
        let extProps = {
            platform: {
                value: "wpf",
                isPii: false,
            },
        };
        extProps = telemetryHelper_1.TelemetryHelper.addPropertyToTelemetryProperties(this.runOptions.reactNativeVersions.reactNativeVersion, "reactNativeVersion", extProps);
        extProps = telemetryHelper_1.TelemetryHelper.addPropertyToTelemetryProperties(this.runOptions.reactNativeVersions.reactNativeWindowsVersion, "reactNativeWindowsVersion", extProps);
        return telemetryHelper_1.TelemetryHelper.generate("WpfPlatform.runApp", extProps, () => {
            const env = generalMobilePlatform_1.GeneralMobilePlatform.getEnvArgument(process.env, this.runOptions.env, this.runOptions.envFile);
            if (enableDebug) {
                this.runArguments.push("--proxy");
            }
            if (!semver.gt(this.runOptions.reactNativeVersions.reactNativeVersion, WpfPlatform.WPF_SUPPORTED)) {
                throw new Error(localize(0, null, this.runOptions.reactNativeVersions.reactNativeVersion));
            }
            if (!semver.valid(this.runOptions.reactNativeVersions.reactNativeVersion) /*Custom RN implementations should support this flag*/ || semver.gte(this.runOptions.reactNativeVersions.reactNativeVersion, WpfPlatform.NO_PACKAGER_VERSION)) {
                this.runArguments.push("--no-packager");
            }
            const exec = new commandExecutor_1.CommandExecutor(this.projectPath, this.logger);
            return Q.Promise((resolve, reject) => {
                const appName = this.projectPath.split(path.sep).pop();
                // Killing another instances of the app which were run earlier
                return exec.execute(`cmd /C Taskkill /IM ${appName}.exe /F`)
                    .finally(() => {
                    const runWpfSpawn = exec.spawnReactCommand(`run-${this.platformName}`, this.runArguments, { env });
                    let resolved = false;
                    let output = "";
                    runWpfSpawn.stdout.on("data", (data) => {
                        output += data.toString();
                        if (!resolved && output.indexOf("Starting the app") > -1) {
                            resolved = true;
                            resolve(void 0);
                        }
                    });
                    runWpfSpawn.stderr.on("data", (error) => {
                        if (error.toString().trim()) {
                            reject(error.toString());
                        }
                    });
                    runWpfSpawn.outcome.then(() => {
                        reject(void 0); // If WPF process ended then app run fault
                    });
                });
            });
        });
    }
}
exports.WpfPlatform = WpfPlatform;
WpfPlatform.WPF_SUPPORTED = "0.55.0";

//# sourceMappingURL=wpfPlatform.js.map
