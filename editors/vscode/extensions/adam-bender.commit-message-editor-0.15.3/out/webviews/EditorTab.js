"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const getNonce_1 = require("../utils/getNonce");
const EditorTab = ({ extensionPath, platform, webview }) => {
    const assetUri = (fp) => {
        const fragments = fp.split('/');
        const vscodeUri = vscode.Uri.file(path.join(extensionPath, ...fragments));
        return webview.asWebviewUri(vscodeUri);
    };
    const { cspSource } = webview;
    const nonce = getNonce_1.default();
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'none'; img-src ${cspSource}; script-src ${cspSource} nonce-${nonce}; style-src 'unsafe-inline' ${cspSource}; style-src-elem 'unsafe-inline' ${cspSource}; font-src ${cspSource}"
      />
      <title>Commit message editor</title>
      <link rel="stylesheet" href="${assetUri('node_modules/vscode-codicons/dist/codicon.css')}" nonce="${nonce}" id="vscode-codicon-stylesheet">
    </head>
    <body class="${platform}">
      <cme-editor-page></cme-editor-page>
      <script src="${assetUri('frontend/dist/bundled.js')}" nonce="${nonce}" type="module"></script>
    </body>
    </html>
  `;
    return html;
};
exports.default = EditorTab;
//# sourceMappingURL=EditorTab.js.map