"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const createPostMessage_1 = require("../utils/createPostMessage");
const getExtensionConfig_1 = require("../utils/getExtensionConfig");
const createLoadTemplateCommand = ({ currentPanel, }) => {
    return vscode.commands.registerCommand('commitMessageEditor.loadTemplate', () => {
        if (!currentPanel) {
            return;
        }
        currentPanel.webview.postMessage(createPostMessage_1.default('receiveConfig', getExtensionConfig_1.default()));
    });
};
exports.default = createLoadTemplateCommand;
//# sourceMappingURL=createLoadTemplateCommand.js.map