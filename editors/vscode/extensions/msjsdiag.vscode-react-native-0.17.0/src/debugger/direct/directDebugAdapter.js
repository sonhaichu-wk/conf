"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectDebugAdapter = void 0;
const path = require("path");
const projectVersionHelper_1 = require("../../common/projectVersionHelper");
const reactNativeProjectHelper_1 = require("../../common/reactNativeProjectHelper");
const errorHelper_1 = require("../../common/error/errorHelper");
const extensionHelper_1 = require("../../common/extensionHelper");
const nodeDebugWrapper_1 = require("../nodeDebugWrapper");
const telemetry_1 = require("../../common/telemetry");
const vscode_debugadapter_1 = require("vscode-debugadapter");
const telemetryHelper_1 = require("../../common/telemetryHelper");
const telemetryReporters_1 = require("../../common/telemetryReporters");
const vscode_chrome_debug_core_1 = require("vscode-chrome-debug-core");
const internalErrorCode_1 = require("../../common/error/internalErrorCode");
const remoteExtension_1 = require("../../common/remoteExtension");
const LogHelper_1 = require("../../extension/log/LogHelper");
const nls = require("vscode-nls");
const Q = require("q");
const localize = nls.loadMessageBundle(__filename);
class DirectDebugAdapter extends vscode_chrome_debug_core_1.ChromeDebugAdapter {
    constructor(opts, debugSession) {
        super(opts, debugSession);
        this.outputLogger = (message, error) => {
            let category = "console";
            if (error === true) {
                category = "stderr";
            }
            if (typeof error === "string") {
                category = error;
            }
            let newLine = "\n";
            if (category === "stdout" || category === "stderr") {
                newLine = "";
            }
            debugSession.sendEvent(new vscode_debugadapter_1.OutputEvent(message + newLine, category));
        };
        this.isSettingsInitialized = false;
    }
    launch(launchArgs) {
        let extProps = {
            platform: {
                value: launchArgs.platform,
                isPii: false,
            },
            isDirect: {
                value: true,
                isPii: false,
            },
        };
        return new Promise((resolve, reject) => this.initializeSettings(launchArgs)
            .then(() => {
            this.outputLogger("Launching the application");
            vscode_chrome_debug_core_1.logger.verbose(`Launching the application: ${JSON.stringify(launchArgs, null, 2)}`);
            return projectVersionHelper_1.ProjectVersionHelper.getReactNativeVersions(launchArgs.cwd, launchArgs.platform === "windows")
                .then(versions => {
                extProps = telemetryHelper_1.TelemetryHelper.addPropertyToTelemetryProperties(versions.reactNativeVersion, "reactNativeVersion", extProps);
                if (launchArgs.platform === "windows") {
                    extProps = telemetryHelper_1.TelemetryHelper.addPropertyToTelemetryProperties(versions.reactNativeWindowsVersion, "reactNativeWindowsVersion", extProps);
                }
                return telemetryHelper_1.TelemetryHelper.generate("launch", extProps, (generator) => {
                    return this.remoteExtension.launch({ "arguments": launchArgs })
                        .then(() => {
                        return this.remoteExtension.getPackagerPort(launchArgs.cwd);
                    })
                        .then((packagerPort) => {
                        launchArgs.port = launchArgs.port || packagerPort;
                        this.attach(launchArgs).then(() => {
                            resolve();
                        }).catch((e) => reject(e));
                    }).catch((e) => reject(e));
                })
                    .catch((err) => {
                    this.outputLogger("An error occurred while launching the application. " + err.message || err, true);
                    this.cleanUp();
                    reject(err);
                });
            });
        }));
    }
    attach(attachArgs) {
        let extProps = {
            platform: {
                value: attachArgs.platform,
                isPii: false,
            },
            isDirect: {
                value: true,
                isPii: false,
            },
        };
        this.previousAttachArgs = attachArgs;
        return new Promise((resolve, reject) => this.initializeSettings(attachArgs)
            .then(() => {
            this.outputLogger("Attaching to the application");
            vscode_chrome_debug_core_1.logger.verbose(`Attaching to the application: ${JSON.stringify(attachArgs, null, 2)}`);
            return projectVersionHelper_1.ProjectVersionHelper.getReactNativeVersions(attachArgs.cwd, true)
                .then(versions => {
                extProps = telemetryHelper_1.TelemetryHelper.addPropertyToTelemetryProperties(versions.reactNativeVersion, "reactNativeVersion", extProps);
                if (!projectVersionHelper_1.ProjectVersionHelper.isVersionError(versions.reactNativeWindowsVersion)) {
                    extProps = telemetryHelper_1.TelemetryHelper.addPropertyToTelemetryProperties(versions.reactNativeWindowsVersion, "reactNativeWindowsVersion", extProps);
                }
                return telemetryHelper_1.TelemetryHelper.generate("attach", extProps, (generator) => {
                    return this.remoteExtension.getPackagerPort(attachArgs.cwd)
                        .then((packagerPort) => {
                        attachArgs.port = attachArgs.port || packagerPort;
                        this.outputLogger(`Connecting to ${attachArgs.port} port`);
                        const attachArguments = Object.assign({}, attachArgs, {
                            address: "localhost",
                            port: attachArgs.port,
                            restart: true,
                            request: "attach",
                            remoteRoot: undefined,
                            localRoot: undefined,
                        });
                        super.attach(attachArguments).then(() => {
                            this.outputLogger("The debugger attached successfully");
                            resolve();
                        }).catch((e) => reject(e));
                    }).catch((e) => reject(e));
                })
                    .catch((err) => {
                    this.outputLogger("An error occurred while attaching to the debugger. " + err.message || err, true);
                    this.cleanUp();
                    reject(err);
                });
            });
        }));
    }
    disconnect(args) {
        this.cleanUp();
        super.disconnect(args);
    }
    onPaused(notification, expectingStopReason = this._expectingStopReason) {
        const _super = Object.create(null, {
            onPaused: { get: () => super.onPaused }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Excluding Hermes native function calls from call stack, since VS Code can't process them properly
            // More info: https://github.com/facebook/hermes/issues/168
            notification.callFrames = notification.callFrames.filter(callFrame => callFrame.functionName !== DirectDebugAdapter.HERMES_NATIVE_FUNCTION_NAME &&
                callFrame.location.scriptId !== DirectDebugAdapter.HERMES_NATIVE_FUNCTION_SCRIPT_ID);
            return _super.onPaused.call(this, notification, expectingStopReason);
        });
    }
    initializeSettings(args) {
        if (!this.isSettingsInitialized) {
            let chromeDebugCoreLogs = LogHelper_1.getLoggingDirectory();
            if (chromeDebugCoreLogs) {
                chromeDebugCoreLogs = path.join(chromeDebugCoreLogs, "ChromeDebugCoreLogs.txt");
            }
            let logLevel = args.trace;
            if (logLevel) {
                logLevel = logLevel.replace(logLevel[0], logLevel[0].toUpperCase());
                vscode_chrome_debug_core_1.logger.setup(vscode_debugadapter_1.Logger.LogLevel[logLevel], chromeDebugCoreLogs || false);
            }
            else {
                vscode_chrome_debug_core_1.logger.setup(vscode_debugadapter_1.Logger.LogLevel.Log, chromeDebugCoreLogs || false);
            }
            if (!args.sourceMaps) {
                args.sourceMaps = true;
            }
            const projectRootPath = nodeDebugWrapper_1.getProjectRoot(args);
            return reactNativeProjectHelper_1.ReactNativeProjectHelper.isReactNativeProject(projectRootPath)
                .then((result) => {
                if (!result) {
                    throw errorHelper_1.ErrorHelper.getInternalError(internalErrorCode_1.InternalErrorCode.NotInReactNativeFolderError);
                }
                this.projectRootPath = projectRootPath;
                this.remoteExtension = remoteExtension_1.RemoteExtension.atProjectRootPath(this.projectRootPath);
                const version = extensionHelper_1.getExtensionVersion();
                // Start to send telemetry
                this._session.getTelemetryReporter().reassignTo(new telemetryReporters_1.RemoteTelemetryReporter("react-native-tools", version, telemetry_1.Telemetry.APPINSIGHTS_INSTRUMENTATIONKEY, this.projectRootPath));
                this.isSettingsInitialized = true;
                return void 0;
            });
        }
        else {
            return Q.resolve(void 0);
        }
    }
    cleanUp() {
        if (this.previousAttachArgs.platform === "android") {
            this.remoteExtension.stopMonitoringLogcat()
                .catch(reason => vscode_chrome_debug_core_1.logger.warn(localize(0, null, reason.message || reason)))
                .finally(() => super.disconnect({ terminateDebuggee: true }));
        }
    }
}
exports.DirectDebugAdapter = DirectDebugAdapter;
/**
 * @description The Hermes native functions calls mark in call stack
 * @type {string}
 */
DirectDebugAdapter.HERMES_NATIVE_FUNCTION_NAME = "(native)";
/**
 * @description Equals to 0xfffffff - the scriptId returned by Hermes debugger, that means "invalid script ID"
 * @type {string}
 */
DirectDebugAdapter.HERMES_NATIVE_FUNCTION_SCRIPT_ID = "4294967295";

//# sourceMappingURL=directDebugAdapter.js.map
