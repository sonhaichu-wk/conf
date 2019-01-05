"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const hover_provider_1 = require("./hover_provider");
const color_extractor_1 = require("./color_extractor");
const color_info_display_1 = require("./color_info_display");
const configuration_1 = require("./configuration");
/**
 * Main extension activation.
 */
function activate(context) {
    function reload() {
        for (const existing of providerRegistrations) {
            existing.dispose();
        }
        while (context.subscriptions.length) {
            context.subscriptions.pop();
        }
        providerRegistrations = [];
        const workspaceConfig = vscode.workspace.getConfiguration('colorInfo');
        const display = new color_info_display_1.ColorDisplay(workspaceConfig);
        const languageConfig = configuration_1.LanguagesConfiguration.load(workspaceConfig);
        for (const lang of languageConfig.languages) {
            const hoverProvider = new hover_provider_1.default(new color_extractor_1.ColorExtractor(lang.colorExtractors), display);
            const registration = vscode.languages.registerHoverProvider(lang.selector, hoverProvider);
            providerRegistrations.push(registration);
            context.subscriptions.push(registration);
        }
    }
    let providerRegistrations = [];
    vscode.workspace.onDidChangeConfiguration(() => {
        reload();
    });
    reload();
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map