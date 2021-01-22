"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const helper_1 = require("./helper");
class Linter {
    constructor(subscriptions) {
        if (vscode_1.workspace.getConfiguration("mjml").lintEnable) {
            this.diagnosticCollection = vscode_1.languages.createDiagnosticCollection("mjml");
            subscriptions.push(this.diagnosticCollection, vscode_1.window.onDidChangeActiveTextEditor((editor) => {
                if (editor && editor.document) {
                    this.lintDocument(editor.document);
                }
            }), vscode_1.workspace.onDidChangeTextDocument((event) => {
                if (event && event.document && vscode_1.workspace.getConfiguration("mjml").lintWhenTyping) {
                    this.lintDocument(event.document);
                }
            }), vscode_1.workspace.onDidCloseTextDocument((document) => {
                if (document) {
                    this.diagnosticCollection.delete(document.uri);
                }
            }), vscode_1.workspace.onDidOpenTextDocument((document) => {
                if (document) {
                    this.lintDocument(document);
                }
            }), vscode_1.workspace.onDidSaveTextDocument((document) => {
                if (document) {
                    this.lintDocument(document);
                }
            }));
            vscode_1.workspace.textDocuments.forEach(this.lintDocument, this);
        }
    }
    dispose() {
        this.diagnosticCollection.clear();
        this.diagnosticCollection.dispose();
    }
    lintDocument(textDocument) {
        if (textDocument.languageId !== "mjml") {
            return;
        }
        const diagnostics = [];
        try {
            const errors = helper_1.mjmlToHtml(textDocument.getText(), false, false, helper_1.getPath(), "strict").errors;
            if (errors && errors[0]) {
                errors[0].errors.forEach((error) => {
                    const line = error.line - 1;
                    const currentLine = textDocument.lineAt(line).text;
                    diagnostics.push(new vscode_1.Diagnostic(new vscode_1.Range(new vscode_1.Position(line, currentLine.indexOf("<")), new vscode_1.Position(line, currentLine.length)), error.message, vscode_1.DiagnosticSeverity.Error));
                });
            }
            this.diagnosticCollection.set(textDocument.uri, diagnostics);
        }
        catch (error) {
            this.diagnosticCollection.set(textDocument.uri, diagnostics);
        }
    }
}
exports.default = Linter;
//# sourceMappingURL=linter.js.map