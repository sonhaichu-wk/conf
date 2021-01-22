"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const vscode_1 = require("vscode");
class Documentation {
    constructor(context) {
        this.content = "";
        this.context = context;
        this.webviewViewColumn = vscode_1.ViewColumn.Two;
        context.subscriptions.push(vscode_1.commands.registerCommand("mjml.documentation", () => {
            this.displayWebView();
        }), vscode_1.commands.registerCommand("mjml.searchInDocumentation", () => {
            this.searchInDocumentation();
        }));
    }
    dispose() {
        if (this.webview !== undefined) {
            this.webview.dispose();
            this.webviewViewColumn = vscode_1.ViewColumn.Two;
        }
    }
    displayWebView() {
        if (!this.webview) {
            const documentationPath = path_1.join(__dirname, "../documentation/documentation.html");
            if (!documentationPath || !fs_1.existsSync(documentationPath) || !fs_1.statSync(documentationPath).isFile()) {
                return;
            }
            this.webview = vscode_1.window.createWebviewPanel("mjml-documentation", "MJML Documentation", vscode_1.ViewColumn.Two, {
                enableFindWidget: true,
                enableScripts: true,
                localResourceRoots: [
                    vscode_1.Uri.parse(this.context.extensionPath)
                ],
                retainContextWhenHidden: true
            });
            this.webview.webview.html = this.getWebviewContent(documentationPath);
            this.webview.onDidChangeViewState(() => {
                if (this.webview && this.webviewViewColumn !== this.webview.viewColumn) {
                    this.webviewViewColumn = this.webview.viewColumn;
                }
            });
            this.webview.onDidDispose(() => {
                this.webview = undefined;
                this.webviewViewColumn = vscode_1.ViewColumn.Two;
            });
        }
        this.webview.reveal(this.webviewViewColumn);
        this.handleEvents();
    }
    getWebviewContent(filePath) {
        if (!this.content) {
            const rootPath = vscode_1.Uri.parse(path_1.join(this.context.extensionPath, "documentation")).with({
                scheme: "vscode-resource"
            }).toString();
            this.content = fs_1.readFileSync(filePath).toString().replace(/{{root}}/gi, rootPath);
        }
        return this.content;
    }
    handleEvents() {
        if (this.webview) {
            this.webview.webview.onDidReceiveMessage((message) => {
                if (message.command === "openExample") {
                    this.openExample(message.data);
                }
            }, undefined, this.context.subscriptions);
        }
    }
    searchInDocumentation() {
        const activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return;
        }
        const text = activeTextEditor.document.getText(activeTextEditor.selection);
        let anchor = text.replace(/((\/|\<|\>)|^\s+|(\r?\n|\r)|\s.*)/gi, "").replace("mj-", "#mjml-");
        if (!anchor.startsWith("#mjml-")) {
            anchor = `#mjml-${anchor}`;
        }
        this.displayWebView();
        if (this.webview) {
            this.webview.webview.postMessage({
                anchor,
                command: "scrollTo"
            });
        }
    }
    openExample(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.join(__dirname, "../documentation/examples/", `${fileName}.mjml`);
            if (filePath && fs_1.existsSync(filePath) && fs_1.statSync(filePath).isFile()) {
                const document = yield vscode_1.workspace.openTextDocument({
                    content: fs_1.readFileSync(filePath, "utf8"),
                    language: "mjml"
                });
                yield vscode_1.window.showTextDocument(document, {
                    viewColumn: vscode_1.ViewColumn.One
                });
                yield vscode_1.commands.executeCommand("mjml.previewToSide");
            }
        });
    }
}
exports.default = Documentation;
//# sourceMappingURL=documentation.js.map