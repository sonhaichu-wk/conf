"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vscode_1 = require("vscode");
const helper_1 = require("./helper");
class Preview {
    constructor(context) {
        this.openedDocuments = [];
        this.previewOpen = false;
        this.subscriptions = context.subscriptions;
        this.subscriptions.push(vscode_1.commands.registerCommand("mjml.previewToSide", () => {
            if (vscode_1.window.activeTextEditor) {
                this.previewOpen = true;
                this.displayWebView(vscode_1.window.activeTextEditor.document);
            }
            else {
                vscode_1.window.showErrorMessage("Active editor doesn't show a MJML document.");
            }
        }), vscode_1.workspace.onDidOpenTextDocument((document) => {
            if (document && this.previewOpen && vscode_1.workspace.getConfiguration("mjml").autoPreview) {
                this.displayWebView(document);
            }
        }), vscode_1.window.onDidChangeActiveTextEditor((editor) => {
            if (editor && this.previewOpen && vscode_1.workspace.getConfiguration("mjml").autoPreview) {
                this.displayWebView(editor.document);
            }
        }), vscode_1.workspace.onDidChangeTextDocument((event) => {
            if (event && this.previewOpen && vscode_1.workspace.getConfiguration("mjml").updateWhenTyping) {
                this.displayWebView(event.document);
            }
        }), vscode_1.workspace.onDidSaveTextDocument((document) => {
            if (document && this.previewOpen) {
                this.displayWebView(document);
            }
        }), vscode_1.workspace.onDidCloseTextDocument((document) => {
            if (document && this.previewOpen && this.webview) {
                this.removeDocument(document.fileName);
                if (this.openedDocuments.length === 0 && vscode_1.workspace.getConfiguration("mjml").autoClosePreview) {
                    this.dispose();
                }
            }
        }));
    }
    dispose() {
        if (this.webview !== undefined) {
            this.webview.dispose();
        }
    }
    displayWebView(document) {
        if (!helper_1.isMJMLFile(document)) {
            return;
        }
        const activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor || !activeTextEditor.document) {
            return;
        }
        const content = this.getContent(document);
        const label = `MJML Preview - ${path_1.basename(activeTextEditor.document.fileName)}`;
        if (!this.webview) {
            this.webview = vscode_1.window.createWebviewPanel("mjml-preview", label, vscode_1.ViewColumn.Two, {
                retainContextWhenHidden: true
            });
            this.webview.webview.html = content;
            this.webview.onDidDispose(() => {
                this.webview = undefined;
                this.previewOpen = false;
            }, null, this.subscriptions);
            if (vscode_1.workspace.getConfiguration("mjml").preserveFocus) {
                vscode_1.window.showTextDocument(activeTextEditor.document, vscode_1.ViewColumn.One);
            }
        }
        else {
            this.webview.title = label;
            this.webview.webview.html = content;
        }
    }
    getContent(document) {
        const html = helper_1.mjmlToHtml(document.getText(), false, false, document.uri.fsPath, "skip").html;
        if (html) {
            this.addDocument(document.fileName);
            return this.setBackgroundColor(helper_1.fixImages(html, document.uri.fsPath));
        }
        return this.error("Active editor doesn't show a MJML document.");
    }
    setBackgroundColor(html) {
        if (vscode_1.workspace.getConfiguration("mjml").previewBackgroundColor) {
            const tmp = /<.*head.*>/i.exec(html);
            if (tmp && tmp[0]) {
                html = html.replace(tmp[0], `${tmp[0]}\n<style>
                    html, body { background-color: ${vscode_1.workspace.getConfiguration("mjml").previewBackgroundColor}; }
                </style>`);
            }
        }
        return html;
    }
    error(error) {
        return `<body>${error}</body>`;
    }
    addDocument(fileName) {
        if (this.openedDocuments.indexOf(fileName) === -1) {
            this.openedDocuments.push(fileName);
        }
    }
    removeDocument(fileName) {
        this.openedDocuments = this.openedDocuments.filter((file) => file !== fileName);
    }
}
exports.default = Preview;
//# sourceMappingURL=preview.js.map