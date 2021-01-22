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
const path_1 = require("path");
const vscode_1 = require("vscode");
const npm_1 = require("npm");
const phantom = require("phantom");
const phantomjs_prebuilt_1 = require("phantomjs-prebuilt");
const helper_1 = require("./helper");
class Screenshot {
    constructor(subscriptions) {
        this.phantomJSBuilt = undefined;
        this.phantomJsPlatform = "";
        this.processPlatform = "";
        if (phantomjs_prebuilt_1.platform !== process.platform) {
            this.rebuild();
        }
        else {
            this.phantomJsPlatform = phantomjs_prebuilt_1.platform;
            this.processPlatform = process.platform;
            subscriptions.push(vscode_1.commands.registerCommand("mjml.screenshot", () => {
                this.renderMJML(false);
            }), vscode_1.commands.registerCommand("mjml.multipleScreenshots", () => {
                this.renderMJML(true);
            }));
        }
    }
    rebuild() {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode_1.window.withProgress({
                cancellable: false,
                location: vscode_1.ProgressLocation.Notification,
                title: `MJML needs to be rebuilt for your current platform. Please wait for the installation to finish...`
            }, () => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    process.chdir(path_1.join(__dirname, ".."));
                    npm_1.load({
                        loglevel: "silent"
                    }, () => {
                        npm_1.commands.rebuild(["phantomjs-prebuilt"], (error) => {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve();
                            }
                        });
                    });
                }).then(() => {
                    this.phantomJSBuilt = true;
                    vscode_1.window.showInformationMessage("MJML's been updated. Please restart VSCode in order to continue using MJML.");
                }).catch(() => {
                    this.phantomJSBuilt = false;
                    vscode_1.window.showErrorMessage("MJML couldn't build the proper version of PhantomJS. Restart VSCode in order to try it again.");
                });
            }));
        });
    }
    renderMJML(multiple) {
        if (this.phantomJsPlatform !== this.processPlatform || this.phantomJSBuilt !== undefined) {
            if (this.phantomJSBuilt) {
                vscode_1.window.showInformationMessage("MJML's been updated. Please restart VSCode in order to continue using MJML.");
            }
            else {
                vscode_1.window.showWarningMessage("MJML couldn't build the proper version of PhantomJS. Restart VSCode in order to try it again.");
            }
        }
        else {
            helper_1.renderMJML((content) => {
                let defaultWidth = vscode_1.workspace.getConfiguration("mjml").screenshotWidth.toString();
                let placeHolder = `Enter image width (${defaultWidth}).`;
                if (multiple) {
                    defaultWidth = vscode_1.workspace.getConfiguration("mjml").screenshotWidths.join(", ");
                    placeHolder = `Comma-separated list of image widths (${defaultWidth}).`;
                }
                vscode_1.window.showInputBox({
                    placeHolder,
                    prompt: "Width",
                    value: defaultWidth
                }).then((width) => {
                    if (!width) {
                        return;
                    }
                    const imgWidth = width.split(",").map((tmpWidth) => {
                        return (tmpWidth) ? parseInt(tmpWidth, 10) : undefined;
                    }).filter((tmpWidth) => {
                        return (tmpWidth) ? tmpWidth : undefined;
                    });
                    if (imgWidth.length > 0) {
                        this.showSaveDialog(multiple, content, imgWidth);
                    }
                });
            }, true);
        }
    }
    showSaveDialog(multiple, content, width) {
        const defaultFileName = path_1.basename(helper_1.getPath()).replace(/\.[^\.]+$/, "");
        let screenshotType = "png";
        if (["png", "jpg", "jpeg"].indexOf(vscode_1.workspace.getConfiguration("mjml").screenshotType)) {
            screenshotType = vscode_1.workspace.getConfiguration("mjml").screenshotType;
        }
        if (vscode_1.workspace.getConfiguration("mjml").showSaveDialog) {
            vscode_1.window.showSaveDialog({
                defaultUri: vscode_1.Uri.file(path_1.resolve(helper_1.getPath(), `../${defaultFileName}.${screenshotType}`)),
                filters: {
                    Images: ["png", "jpg", "jpeg"]
                }
            }).then((fileUri) => {
                if (fileUri) {
                    this.screenshot(multiple, fileUri.fsPath, content, width, screenshotType);
                }
            });
        }
        else {
            vscode_1.window.showInputBox({
                placeHolder: "Enter a filename.",
                prompt: "Filename",
                value: `${defaultFileName}.${screenshotType}`
            }).then((fileName) => {
                if (!fileName) {
                    return;
                }
                fileName = fileName ? fileName.replace(/\.[^\.]+$/, "") : defaultFileName;
                const file = path_1.resolve(helper_1.getPath(), `../${fileName}.${screenshotType}`);
                this.screenshot(multiple, file, content, width, screenshotType);
            });
        }
    }
    screenshot(multiple, file, html, width, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode_1.window.withProgress({
                cancellable: false,
                location: vscode_1.ProgressLocation.Notification,
                title: `Taking ${((multiple) ? "screenshots" : "screenshot")}...`
            }, () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const instance = yield phantom.create();
                    const page = yield instance.createPage();
                    yield page.setContent(html, "");
                    yield page.reload();
                    for (const imgWidth of width) {
                        if (imgWidth && Number.isInteger(imgWidth)) {
                            let filePath;
                            let imageName;
                            if (multiple) {
                                const fileName = path_1.basename(file).split(".").slice(0, -1).join(".") +
                                    "_" +
                                    imgWidth.toString();
                                filePath = path_1.resolve(helper_1.getPath(), `../${fileName}.${type}`);
                                imageName = `${fileName}.${type}`;
                            }
                            else {
                                filePath = imageName = file;
                            }
                            yield page.property("viewportSize", {
                                height: 480,
                                width: imgWidth
                            });
                            yield page.render(filePath, {
                                quality: vscode_1.workspace.getConfiguration("mjml").screenshotQuality
                            });
                            vscode_1.window.showInformationMessage(`Successfully saved screenshot ${imageName}`);
                            if (!multiple) {
                                break;
                            }
                        }
                    }
                    yield instance.exit();
                }
                catch (error) {
                    vscode_1.window.showErrorMessage(error.message);
                }
            }));
        });
    }
}
exports.default = Screenshot;
//# sourceMappingURL=screenshot.js.map