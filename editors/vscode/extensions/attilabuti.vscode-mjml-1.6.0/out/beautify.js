"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const helper_1 = require("./helper");
class Beautify {
    constructor(subscriptions) {
        subscriptions.push(vscode_1.languages.registerDocumentFormattingEditProvider({
            language: "mjml",
            scheme: "file"
        }, {
            provideDocumentFormattingEdits(document) {
                const formattedDocument = helper_1.beautifyHTML(document.getText());
                if (formattedDocument) {
                    return [vscode_1.TextEdit.replace(getRange(document), formattedDocument)];
                }
                return [vscode_1.TextEdit.replace(getRange(document), document.getText())];
            }
        }), vscode_1.commands.registerCommand("mjml.beautify", () => {
            this.beautify();
        }));
    }
    beautify() {
        const activeTextEditor = vscode_1.window.activeTextEditor;
        if (activeTextEditor && helper_1.isMJMLFile(activeTextEditor.document)) {
            activeTextEditor.edit((editBuilder) => {
                const formattedDocument = helper_1.beautifyHTML(activeTextEditor.document.getText());
                if (formattedDocument) {
                    editBuilder.replace(getRange(activeTextEditor.document), formattedDocument);
                }
            });
        }
        else {
            vscode_1.window.showWarningMessage("This is not a MJML document!");
            return;
        }
    }
}
exports.default = Beautify;
function getRange(document) {
    return new vscode_1.Range(new vscode_1.Position(0, 0), new vscode_1.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length));
}
//# sourceMappingURL=beautify.js.map