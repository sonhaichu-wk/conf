"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const createPostMessage_1 = require("../utils/createPostMessage");
const createLoadTemplateCommand = ({ currentPanel, }) => {
    return vscode.commands.registerCommand('commitMessageEditor.loadTemplate', () => {
        if (!currentPanel) {
            return;
        }
        currentPanel.webview.postMessage(createPostMessage_1.default('receiveConfig', vscode.workspace.getConfiguration('commit-message-editor')));
    });
};
exports.default = createLoadTemplateCommand;
//# sourceMappingURL=createLoadTemplateCommand.js.map