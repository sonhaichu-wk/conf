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
const vscode = require("vscode");
const experimentService_1 = require("../experimentService");
const experimentsStrings_1 = require("../experimentsStrings");
class RNTPreviewPrompt {
    run(newExpConfig, curExpParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (curExpParameters
                && (curExpParameters.promptShown
                    || newExpConfig.popCoveragePercent === curExpParameters.popCoveragePercent)) {
                return {
                    resultStatus: experimentService_1.ExperimentStatuses.DISABLED,
                    updatedExperimentParameters: curExpParameters,
                };
            }
            const updatedExperimentParameters = this.showPrompIfThresholdIsNotExceeded(newExpConfig, curExpParameters);
            return {
                resultStatus: experimentService_1.ExperimentStatuses.ENABLED,
                updatedExperimentParameters,
            };
        });
    }
    showPrompIfThresholdIsNotExceeded(newExpConfig, promptParameters) {
        if (promptParameters) {
            promptParameters.popCoveragePercent = newExpConfig.popCoveragePercent;
        }
        else {
            promptParameters = Object.assign({}, newExpConfig, {
                extensionId: "msjsdiag.vscode-react-native-preview",
                promptShown: false,
            });
        }
        if (newExpConfig.popCoveragePercent > Math.random()) {
            const buttonText = "Open extension";
            vscode.window.showInformationMessage(experimentsStrings_1.PROMPT_TITLES.RNT_PREVIEW_PROMPT, buttonText)
                .then(selection => {
                if (selection === buttonText && promptParameters) {
                    vscode.commands.executeCommand("workbench.extensions.search", promptParameters.extensionId);
                    vscode.commands.executeCommand("extension.open", promptParameters.extensionId);
                }
            });
            promptParameters.promptShown = true;
        }
        else {
            promptParameters.promptShown = false;
        }
        return promptParameters;
    }
}
exports.default = RNTPreviewPrompt;

//# sourceMappingURL=RNTPreviewPrompt.js.map
