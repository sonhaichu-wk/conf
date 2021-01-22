"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const vscode_1 = require("vscode");
const js_beautify_1 = require("js-beautify");
const mime_1 = require("mime");
const mjml_1 = require("mjml");
function renderMJML(cb, fixImg, minify, beautify) {
    const activeTextEditor = vscode_1.window.activeTextEditor;
    if (!activeTextEditor) {
        return;
    }
    if (!isMJMLFile(activeTextEditor.document)) {
        vscode_1.window.showWarningMessage("This is not a MJML document!");
        return;
    }
    let content = mjmlToHtml(activeTextEditor.document.getText(), minify !== undefined ? minify : vscode_1.workspace.getConfiguration("mjml").minifyHtmlOutput, beautify !== undefined ? beautify : vscode_1.workspace.getConfiguration("mjml").beautifyHtmlOutput).html;
    if (content) {
        if (fixImg !== undefined && fixImg) {
            content = fixImages(content, getPath());
        }
        return cb(content);
    }
    else {
        vscode_1.window.showErrorMessage(`MJMLError: Failed to parse file ${path_1.basename(getPath())}`);
    }
}
exports.renderMJML = renderMJML;
function isMJMLFile(document) {
    return document.languageId === "mjml" && (document.uri.scheme === "file" || document.uri.scheme === "untitled");
}
exports.isMJMLFile = isMJMLFile;
function mjmlToHtml(mjml, minify, beautify, path, validation = "skip") {
    try {
        if (!path) {
            path = getPath();
        }
        return mjml_1.default(mjml, {
            beautify,
            filePath: path,
            minify,
            mjmlConfigPath: getCWD(path),
            validationLevel: validation
        });
    }
    catch (error) {
        return { html: "", errors: [error] };
    }
}
exports.mjmlToHtml = mjmlToHtml;
function fixImages(text, mjmlPath) {
    return text.replace(new RegExp(/((?:src|url)(?:=|\()(?:[\'\"]|))((?!http|\\|"|#).+?)([\'\"]|\))/, "gmi"), (_1, start, src, end) => {
        return start + encodeImage(path_1.join(path_1.dirname(mjmlPath), src), src) + end;
    });
}
exports.fixImages = fixImages;
function beautifyHTML(mjml) {
    try {
        const replaced = mjml.replace(new RegExp(/<.*mj-style[^>]*>(?:[^<>]+)<.*\/.*mj-style>/, "gmi"), (style) => {
            return style.replace(/mj-style/gi, "style");
        });
        const beautified = js_beautify_1.html(replaced, vscode_1.workspace.getConfiguration("mjml").beautify);
        if (replaced !== mjml) {
            return beautified.replace(new RegExp(/<.*style[^>]*>(?:[^<>]+)<.*\/.*style>/, "gmi"), (styleBlock) => {
                return styleBlock.replace(new RegExp(/<.*style.*>/, "gi"), (style) => {
                    return style.replace("style", "mj-style");
                });
            });
        }
        return beautified;
    }
    catch (error) {
        vscode_1.window.showErrorMessage(error);
        return;
    }
}
exports.beautifyHTML = beautifyHTML;
function getPath() {
    if (vscode_1.window.activeTextEditor && vscode_1.window.activeTextEditor.document) {
        return vscode_1.window.activeTextEditor.document.uri.fsPath;
    }
    return "";
}
exports.getPath = getPath;
function getCWD(mjmlPath) {
    if (vscode_1.workspace.rootPath) {
        return vscode_1.workspace.rootPath;
    }
    return (mjmlPath) ? path_1.parse(mjmlPath).dir : "";
}
function encodeImage(filePath, original) {
    const mimeType = mime_1.getType(filePath);
    if (!mimeType) {
        return original;
    }
    const extension = mime_1.getExtension(mimeType);
    if (!extension || ["bmp", "gif", "jpeg", "jpg", "png", "svg"].indexOf(extension) === -1) {
        return original;
    }
    if (filePath && fs_1.existsSync(filePath) && fs_1.statSync(filePath).isFile()) {
        const data = fs_1.readFileSync(filePath);
        if (data) {
            return `data:${mimeType};base64,${data.toString("base64")}`;
        }
    }
    return original;
}
//# sourceMappingURL=helper.js.map