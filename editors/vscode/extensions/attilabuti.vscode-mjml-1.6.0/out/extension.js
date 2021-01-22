"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const beautify_1 = require("./beautify");
const copy_1 = require("./copy");
const documentation_1 = require("./documentation");
const email_1 = require("./email");
const export_1 = require("./export");
const linter_1 = require("./linter");
const migrate_1 = require("./migrate");
const preview_1 = require("./preview");
const screenshot_1 = require("./screenshot");
const template_1 = require("./template");
const version_1 = require("./version");
const helper_1 = require("./helper");
let context;
let extensionFeatures = [];
function activate(extensionContext) {
    context = extensionContext;
    extensionFeatures = [
        new beautify_1.default(context.subscriptions),
        new copy_1.default(context.subscriptions),
        new documentation_1.default(context),
        new email_1.default(context.subscriptions),
        new export_1.default(context.subscriptions),
        new linter_1.default(context.subscriptions),
        new migrate_1.default(context.subscriptions),
        new preview_1.default(context),
        new screenshot_1.default(context.subscriptions),
        new template_1.default(context),
        new version_1.default(context.subscriptions)
    ];
    vscode_1.workspace.onDidOpenTextDocument((document) => {
        if (document && helper_1.isMJMLFile(document) && document.getText().indexOf("mj-container") > -1) {
            vscode_1.window.showInformationMessage(`MJML v3 syntax detected. Use "MJML: Migrate" to get the migrated MJML.`);
        }
    }, null, context.subscriptions);
}
exports.activate = activate;
function deactivate() {
    for (const feature of extensionFeatures) {
        if (typeof feature.dispose === "function") {
            feature.dispose();
        }
    }
    for (const subscription of context.subscriptions) {
        subscription.dispose();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map