"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const createPostMessage_1 = require("../utils/createPostMessage");
const createCopyFromSCMInputBoxCommand = ({ currentPanel, git, }) => {
    return vscode.commands.registerCommand('commitMessageEditor.copyFromSCMInputBox', () => {
        if (!currentPanel) {
            return;
        }
        currentPanel.webview.postMessage(createPostMessage_1.default('copyFromSCMInputBox', git.getSCMInputBoxMessage()));
    });
};
exports.default = createCopyFromSCMInputBoxCommand;
//# sourceMappingURL=createCopyFromSCMInputBoxCommand.js.map