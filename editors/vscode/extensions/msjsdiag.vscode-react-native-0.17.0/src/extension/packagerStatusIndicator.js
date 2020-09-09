"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackagerStatusIndicator = exports.PackagerStatus = void 0;
const vscode_1 = require("vscode");
const nls = require("vscode-nls");
const settingsHelper_1 = require("./settingsHelper");
const localize = nls.loadMessageBundle(__filename);
/**
 * Updates the Status bar with the status of React Native Packager.
 */
var PackagerStatus;
(function (PackagerStatus) {
    PackagerStatus[PackagerStatus["PACKAGER_STOPPED"] = 0] = "PACKAGER_STOPPED";
    PackagerStatus[PackagerStatus["PACKAGER_STOPPING"] = 1] = "PACKAGER_STOPPING";
    PackagerStatus[PackagerStatus["PACKAGER_STARTED"] = 2] = "PACKAGER_STARTED";
    PackagerStatus[PackagerStatus["PACKAGER_STARTING"] = 3] = "PACKAGER_STARTING";
})(PackagerStatus = exports.PackagerStatus || (exports.PackagerStatus = {}));
class PackagerStatusIndicator {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.restartPackagerItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 10);
        this.restartPackagerItem.text = PackagerStatusIndicator.RESTART_ICON;
        this.restartPackagerItem.command = PackagerStatusIndicator.RESTART_COMMAND;
        this.restartPackagerItem.tooltip = localize(0, null);
        this.togglePackagerItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 10);
        this.setupPackagerStatusIndicatorItems(PackagerStatusIndicator.START_ICON, PackagerStatusIndicator.START_COMMAND, localize(1, null));
    }
    updateDisplayVersion() {
        this.displayVersion = PackagerStatusIndicator.FULL_VERSION;
        try {
            if (this.projectRoot) {
                this.displayVersion = settingsHelper_1.SettingsHelper.getPackagerStatusIndicatorPattern(this.projectRoot);
            }
        }
        catch (e) {
            // We are trying to read the configuration from settings.json.
            // If this cannot be done, ignore the error and set the default value.
        }
    }
    dispose() {
        this.togglePackagerItem.dispose();
        this.restartPackagerItem.dispose();
    }
    setupPackagerStatusIndicatorItems(icon, command, tooltip = "") {
        this.updateDisplayVersion();
        this.togglePackagerItem.command = command;
        this.togglePackagerItem.tooltip = tooltip;
        switch (this.displayVersion) {
            case PackagerStatusIndicator.FULL_VERSION:
                this.togglePackagerItem.text = `${icon} ${PackagerStatusIndicator.PACKAGER_NAME}`;
                this.togglePackagerItem.show();
                this.restartPackagerItem.hide();
                break;
            case PackagerStatusIndicator.SHORT_VERSION:
                this.togglePackagerItem.text = `${icon}`;
                this.togglePackagerItem.show();
                this.restartPackagerItem.show();
                break;
        }
    }
    updatePackagerStatus(status) {
        switch (status) {
            case PackagerStatus.PACKAGER_STOPPED:
                this.setupPackagerStatusIndicatorItems(PackagerStatusIndicator.START_ICON, PackagerStatusIndicator.START_COMMAND, localize(2, null));
                break;
            case PackagerStatus.PACKAGER_STOPPING:
                this.setupPackagerStatusIndicatorItems(PackagerStatusIndicator.ACTIVITY_ICON, undefined);
                break;
            case PackagerStatus.PACKAGER_STARTED:
                this.setupPackagerStatusIndicatorItems(PackagerStatusIndicator.STOP_ICON, PackagerStatusIndicator.STOP_COMMAND, localize(3, null));
                break;
            case PackagerStatus.PACKAGER_STARTING:
                this.setupPackagerStatusIndicatorItems(PackagerStatusIndicator.ACTIVITY_ICON, undefined);
                break;
            default:
                break;
        }
    }
}
exports.PackagerStatusIndicator = PackagerStatusIndicator;
PackagerStatusIndicator.PACKAGER_NAME = localize(4, null);
PackagerStatusIndicator.START_ICON = "$(play)";
PackagerStatusIndicator.STOP_ICON = "$(primitive-square)";
PackagerStatusIndicator.ACTIVITY_ICON = "$(loading~spin)";
PackagerStatusIndicator.RESTART_ICON = "$(sync)";
PackagerStatusIndicator.START_COMMAND = "reactNative.startPackager";
PackagerStatusIndicator.RESTART_COMMAND = "reactNative.restartPackager";
PackagerStatusIndicator.STOP_COMMAND = "reactNative.stopPackager";
PackagerStatusIndicator.FULL_VERSION = "Full";
PackagerStatusIndicator.SHORT_VERSION = "Short";

//# sourceMappingURL=packagerStatusIndicator.js.map
