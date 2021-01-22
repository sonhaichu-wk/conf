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
const node_fetch_1 = require("node-fetch");
class Template {
    constructor(context) {
        this.templateList = [];
        this.context = context;
        context.subscriptions.push(vscode_1.commands.registerCommand("mjml.template", () => {
            this.fetchTemplates();
        }));
    }
    fetchTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            if (vscode_1.workspace.getConfiguration("mjml").templateGallery && this.webview) {
                this.webview.reveal(this.webviewViewColumn);
                return;
            }
            if (!this.templateList) {
                return;
            }
            this.templateList = yield vscode_1.window.withProgress({
                cancellable: false,
                location: vscode_1.ProgressLocation.Notification,
                title: "Fetching templates..."
            }, () => __awaiter(this, void 0, void 0, function* () {
                const response = yield node_fetch_1.default("https://api.github.com/repos/mjmlio/email-templates/git/trees/master?recursive=1");
                const { tree } = yield response.json();
                if (!tree) {
                    vscode_1.window.showErrorMessage("Error occurred while fetching templates list.");
                    return;
                }
                return yield tree.reduce((map, item) => {
                    const extract = /.*\/([^.]*)\..*/.exec(item.path);
                    if (!item.path.startsWith("templates/") && !item.path.startsWith("thumbnails/") && !extract) {
                        return map;
                    }
                    if (extract && extract[1]) {
                        const templateName = extract[1];
                        if (!map[templateName]) {
                            map[templateName] = {};
                        }
                        const path = `https://raw.githubusercontent.com/mjmlio/email-templates/master/${item.path}`;
                        if (item.path.endsWith(".mjml")) {
                            map[templateName].mjml = path;
                            map[templateName].name = templateName;
                        }
                        else {
                            map[templateName].thumbnail = path;
                        }
                        return map;
                    }
                }, {});
            }));
            if (vscode_1.workspace.getConfiguration("mjml").templateGallery) {
                this.displayWebView();
            }
            else {
                this.quickPick();
            }
        });
    }
    quickPick() {
        vscode_1.window.showQuickPick(Object.keys(this.templateList), {
            placeHolder: "Choose a template"
        }).then((selected) => {
            if (!selected) {
                return;
            }
            this.createFile(this.templateList[selected].mjml, true);
        });
    }
    displayWebView() {
        if (!this.webview) {
            this.webviewViewColumn = vscode_1.ViewColumn.One;
            this.webview = vscode_1.window.createWebviewPanel("mjml-templates", "MJML Templates", vscode_1.ViewColumn.One, {
                enableScripts: true,
                localResourceRoots: [
                    vscode_1.Uri.parse(this.context.extensionPath)
                ],
                retainContextWhenHidden: true
            });
            let html = "";
            for (const item in this.templateList) {
                if (!this.templateList.hasOwnProperty(item)) {
                    continue;
                }
                html += `
                <div class="template"
                style="background-image:url('${this.templateList[item].thumbnail}');"
                onclick="createFile('${this.templateList[item].mjml}');">
                    <div class="name">${this.templateList[item].name}</div>
                </div>`;
            }
            const galleryPath = path_1.join(__dirname, "../resources/templates/gallery.html");
            if (!galleryPath || !fs_1.existsSync(galleryPath) || !fs_1.statSync(galleryPath).isFile()) {
                return;
            }
            this.webview.webview.html = fs_1.readFileSync(galleryPath, "utf8").replace("{{templates}}", html);
            this.webview.onDidChangeViewState(() => {
                if (this.webview && this.webviewViewColumn !== this.webview.viewColumn) {
                    this.webviewViewColumn = this.webview.viewColumn;
                }
            });
            this.webview.onDidDispose(() => {
                this.webview = undefined;
                this.webviewViewColumn = vscode_1.ViewColumn.One;
            });
        }
        this.handleEvents();
    }
    handleEvents() {
        if (this.webview) {
            this.webview.webview.onDidReceiveMessage((message) => {
                if (message.command === "createFile") {
                    this.createFile(message.data, false);
                }
            }, undefined, this.context.subscriptions);
        }
    }
    createFile(templateURL, activeEditor) {
        node_fetch_1.default(templateURL).then((response) => {
            if (response.status === 200) {
                return response.text();
            }
        }).then((body) => __awaiter(this, void 0, void 0, function* () {
            if (body) {
                if (activeEditor) {
                    const activeTextEditor = vscode_1.window.activeTextEditor;
                    if (!activeTextEditor) {
                        return;
                    }
                    activeTextEditor.edit((editBuilder) => {
                        editBuilder.insert(activeTextEditor.selection.active, body);
                    });
                }
                else {
                    const document = yield vscode_1.workspace.openTextDocument({
                        content: body,
                        language: "mjml"
                    });
                    yield vscode_1.window.showTextDocument(document, {
                        viewColumn: vscode_1.ViewColumn.One
                    });
                    if (vscode_1.workspace.getConfiguration("mjml").templateGalleryAutoClose && this.webview) {
                        this.webview.dispose();
                    }
                }
            }
            else {
                vscode_1.window.showErrorMessage("Error occurred while fetching template.");
            }
        }));
    }
}
exports.default = Template;
//# sourceMappingURL=template.js.map