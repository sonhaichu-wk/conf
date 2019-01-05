"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
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
class ExponentPlatform extends generalMobilePlatform_1.GeneralMobilePlatform {
    constructor(runOptions, platformDeps = {}) {
        super(runOptions, platformDeps);
        this.qrCodeContentProvider = new qrCodeContentProvider_1.QRCodeContentProvider();
        this.exponentHelper = new exponentHelper_1.ExponentHelper(runOptions.workspaceRoot, runOptions.projectRoot);
        this.exponentTunnelPath = null;
    }
    runApp() {
        const extProps = {
            platform: {
                value: "exponent",
                isPii: false,
            },
        };
        return telemetryHelper_1.TelemetryHelper.generate("ExponentPlatform.runApp", extProps, () => {
            return this.exponentHelper.loginToExponent((message, password) => {
                return Q.Promise((resolve, reject) => {
                    vscode.window.showInputBox({ placeHolder: message, password: password })
                        .then(login => {
                        resolve(login || "");
                    }, reject);
                });
            }, (message) => {
                return Q.Promise((resolve, reject) => {
                    vscode.window.showInformationMessage(message)
                        .then(password => {
                        resolve(password || "");
                    }, reject);
                });
            })
                .then(() => XDL.setOptions(this.projectPath, { packagerPort: this.packager.port }))
                .then(() => XDL.startExponentServer(this.projectPath))
                .then(() => XDL.startTunnels(this.projectPath))
                .then(() => XDL.getUrl(this.projectPath, { dev: true, minify: false })).then(exponentUrl => {
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
                    return Q.reject(errorHelper_1.ErrorHelper.getInternalError(internalErrorCode_1.InternalErrorCode.ExpectedExponentTunnelPath, "No link provided by exponent. Is your project correctly setup?"));
                }
                this.exponentTunnelPath = exponentUrl;
                const outputMessage = `Application is running on Exponent. Open your exponent app at ${this.exponentTunnelPath} to see it.`;
                this.logger.info(outputMessage);
                return Q.resolve(void 0);
            });
        });
    }
    beforeStartPackager() {
        return this.exponentHelper.configureExponentEnvironment();
    }
    enableJSDebuggingMode() {
        this.logger.info("Application is running on Exponent. Please shake device and select 'Debug JS Remotely' to enable debugging.");
        return Q.resolve(void 0);
    }
    getRunArguments() {
        return [];
    }
}
exports.ExponentPlatform = ExponentPlatform;

//# sourceMappingURL=exponentPlatform.js.map
