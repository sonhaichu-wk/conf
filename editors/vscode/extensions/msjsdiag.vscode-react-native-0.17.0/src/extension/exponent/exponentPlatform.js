"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExponentPlatform = void 0;
const errorHelper_1 = require("../../common/error/errorHelper");
const internalErrorCode_1 = require("../../common/error/internalErrorCode");
const generalMobilePlatform_1 = require("../generalMobilePlatform");
const exponentHelper_1 = require("./exponentHelper");
const telemetryHelper_1 = require("../../common/telemetryHelper");
const qrCodeContentProvider_1 = require("../qrCodeContentProvider");
const vscode = require("vscode");
const Q = require("q");
const XDL = require("./xdlInterface");
const url = require("url");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
class ExponentPlatform extends generalMobilePlatform_1.GeneralMobilePlatform {
    constructor(runOptions, platformDeps = {}) {
        super(runOptions, platformDeps);
        this.qrCodeContentProvider = new qrCodeContentProvider_1.QRCodeContentProvider();
        this.exponentHelper = new exponentHelper_1.ExponentHelper(runOptions.workspaceRoot, runOptions.projectRoot);
        this.exponentTunnelPath = null;
    }
    runApp() {
        let extProps = {
            platform: {
                value: "exponent",
                isPii: false,
            },
        };
        extProps = telemetryHelper_1.TelemetryHelper.addPropertyToTelemetryProperties(this.runOptions.reactNativeVersions.reactNativeVersion, "reactNativeVersion", extProps);
        extProps = telemetryHelper_1.TelemetryHelper.addPropertyToTelemetryProperties(this.runOptions.expoHostType, "expoHostType", extProps);
        return telemetryHelper_1.TelemetryHelper.generate("ExponentPlatform.runApp", extProps, () => {
            return this.loginToExponentOrSkip(this.runOptions.expoHostType)
                .then(() => XDL.setOptions(this.projectPath, { packagerPort: this.packager.getPort() }))
                .then(() => XDL.startExponentServer(this.projectPath))
                .then(() => {
                if (this.runOptions.expoHostType !== "tunnel") {
                    // the purpose of this is to save the same sequence of handling 'adb reverse' command execution as in Expo
                    // https://github.com/expo/expo-cli/blob/1d515d21200841e181518358fd9dc4c7b24c7cd6/packages/xdl/src/Project.ts#L2226-L2370
                    // we added this to be sure that our Expo launching logic doesn't have any negative side effects
                    return XDL.stopAdbReverse(this.projectPath);
                }
                return XDL.startTunnels(this.projectPath);
            })
                .then(() => {
                if (this.runOptions.expoHostType !== "local")
                    return false;
                // we need to execute 'adb reverse' command to bind ports used by Expo and RN of local machine to ports of a connected Android device or a running emulator
                return XDL.startAdbReverse(this.projectPath);
            })
                .then((isAdbReversed) => {
                switch (this.runOptions.expoHostType) {
                    case "lan":
                        return XDL.getUrl(this.projectPath, { dev: true, minify: false, hostType: "lan" });
                    case "local":
                        if (isAdbReversed) {
                            this.logger.info(localize(0, null));
                        }
                        else {
                            this.logger.warning(localize(1, null));
                        }
                        return XDL.getUrl(this.projectPath, { dev: true, minify: false, hostType: "localhost" });
                    case "tunnel":
                    default:
                        return XDL.getUrl(this.projectPath, { dev: true, minify: false });
                }
            })
                .then(exponentUrl => {
                return "exp://" + url.parse(exponentUrl).host;
            })
                .catch(reason => {
                return Q.reject(reason);
            })
                .then(exponentUrl => {
                let exponentPage = vscode.window.createWebviewPanel("Expo QR Code", "Expo QR Code", vscode.ViewColumn.Two, {});
                exponentPage.webview.html = this.qrCodeContentProvider.provideTextDocumentContent(vscode.Uri.parse(exponentUrl));
                return exponentUrl;
            })
                .then(exponentUrl => {
                if (!exponentUrl) {
                    return Q.reject(errorHelper_1.ErrorHelper.getInternalError(internalErrorCode_1.InternalErrorCode.ExpectedExponentTunnelPath));
                }
                this.exponentTunnelPath = exponentUrl;
                const outputMessage = localize(2, null, this.exponentTunnelPath);
                this.logger.info(outputMessage);
                return Q.resolve(void 0);
            });
        });
    }
    loginToExponentOrSkip(expoHostType) {
        if (expoHostType !== "tunnel") {
            return Q({});
        }
        return this.exponentHelper.loginToExponent((message, password) => {
            return Q.Promise((resolve, reject) => {
                vscode.window.showInputBox({ placeHolder: message, password: password })
                    .then(login => {
                    resolve(login || "");
                }, reject);
            });
        }, (message) => {
            return Q.Promise((resolve, reject) => {
                const okButton = { title: "Ok" };
                const cancelButton = { title: "Cancel", isCloseAffordance: true };
                vscode.window.showInformationMessage(message, { modal: true }, okButton, cancelButton)
                    .then(answer => {
                    if (answer === cancelButton) {
                        reject(errorHelper_1.ErrorHelper.getInternalError(internalErrorCode_1.InternalErrorCode.UserCancelledExpoLogin));
                    }
                    resolve("");
                }, reject);
            });
        });
    }
    beforeStartPackager() {
        return this.exponentHelper.configureExponentEnvironment();
    }
    enableJSDebuggingMode() {
        this.logger.info(localize(3, null));
        return Q.resolve(void 0);
    }
    getRunArguments() {
        return [];
    }
}
exports.ExponentPlatform = ExponentPlatform;

//# sourceMappingURL=exponentPlatform.js.map
