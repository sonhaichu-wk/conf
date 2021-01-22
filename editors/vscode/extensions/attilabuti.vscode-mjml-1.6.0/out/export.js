"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const vscode_1 = require("vscode");
const helper_1 = require("./helper");
class Export {
    constructor(subscriptions) {
        subscriptions.push(vscode_1.commands.registerCommand("mjml.exportHTML", () => {
            this.export();
        }));
    }
    export() {
        helper_1.renderMJML((content) => {
            const defaultFileName = path_1.basename(helper_1.getPath()).replace(/\.[^\.]+$/, "");
            let exportType = vscode_1.workspace.getConfiguration("mjml").exportType;
            if (!exportType.startsWith(".")) {
                exportType = `.${exportType}`;
            }
            if (vscode_1.workspace.getConfiguration("mjml").showSaveDialog) {
                vscode_1.window.showSaveDialog({
                    defaultUri: vscode_1.Uri.file(path_1.resolve(helper_1.getPath(), `../${defaultFileName}${exportType}`)),
                    filters: {
                        "All files": ["*"],
                        "HTML": ["html"]
                    }
                }).then((fileUri) => {
                    if (fileUri) {
                        this.writeFile(fileUri.fsPath, content);
                    }
                });
            }
            else {
                vscode_1.window.showInputBox({
                    placeHolder: `Enter a filename (${defaultFileName}${exportType} or .xyz).`,
                    prompt: "Filename",
                    value: defaultFileName + exportType
                }).then((fileName) => {
                    if (!fileName) {
                        return;
                    }
                    if (!/[.]/.exec(fileName)) {
                        fileName += exportType;
                    }
                    if (fileName.startsWith(".")) {
                        fileName = defaultFileName + fileName;
                    }
                    this.writeFile(path_1.resolve(helper_1.getPath(), `../${fileName}`), content);
                });
            }
        });
    }
    writeFile(file, content) {
        fs_1.writeFile(file, content, (error) => {
            if (error) {
                vscode_1.window.showErrorMessage(`Could not save the file: ${error.message}`);
            }
            else {
                vscode_1.window.showInformationMessage(`File saved as ${path_1.basename(file)}`);
            }
        });
    }
}
exports.default = Export;
//# sourceMappingURL=export.js.map