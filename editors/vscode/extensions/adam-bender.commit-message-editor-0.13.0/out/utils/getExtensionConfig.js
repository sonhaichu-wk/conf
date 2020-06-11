"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const getExtensionConfig = () => {
    return {
        staticTemplate: vscode.workspace
            .getConfiguration('commit-message-editor')
            .get('staticTemplate'),
        dynamicTemplate: vscode.workspace
            .getConfiguration('commit-message-editor')
            .get('dynamicTemplate'),
        tokens: vscode.workspace
            .getConfiguration('commit-message-editor')
            .get('tokens'),
        showRecentCommits: !!vscode.workspace
            .getConfiguration('commit-message-editor.view')
            .get('showRecentCommits'),
        saveAndClose: !!vscode.workspace
            .getConfiguration('commit-message-editor.view')
            .get('saveAndClose'),
    };
};
exports.default = getExtensionConfig;
//# sourceMappingURL=getExtensionConfig.js.map