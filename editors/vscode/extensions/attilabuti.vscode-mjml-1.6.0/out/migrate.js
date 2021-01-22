"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const vscode_1 = require("vscode");
const mjml_migrate_1 = require("mjml-migrate");
const helper_1 = require("./helper");
class Migrate {
    constructor(subscriptions) {
        subscriptions.push(vscode_1.commands.registerCommand("mjml.migrate", () => {
            this.migrate();
        }));
    }
    migrate() {
        const activeTextEditor = vscode_1.window.activeTextEditor;
        if (!activeTextEditor) {
            return;
        }
        if (!helper_1.isMJMLFile(activeTextEditor.document)) {
            vscode_1.window.showWarningMessage("This is not a MJML document!");
            return;
        }
        try {
            const mjml = mjml_migrate_1.default(activeTextEditor.document.getText());
            if (!mjml) {
                return;
            }
            const inputFileName = path_1.basename(helper_1.getPath());
            const fileName = inputFileName.replace(/\.[^\.]+$/, "");
            const file = path_1.resolve(helper_1.getPath(), `../${fileName}_v4.mjml`);
            const content = helper_1.beautifyHTML(mjml);
            if (content) {
                fs_1.writeFile(file, content, (error) => {
                    if (error) {
                        vscode_1.window.showErrorMessage(error.message);
                    }
                    else {
                        vscode_1.window.showInformationMessage(`${inputFileName} was converted to the MJML 4 syntax in ${fileName}_v4.mjml`);
                    }
                });
            }
            else {
                vscode_1.window.showErrorMessage("Something went wrong.");
            }
        }
        catch (error) {
            vscode_1.window.showErrorMessage("Input file failed to render.");
            return;
        }
    }
}
exports.default = Migrate;
//# sourceMappingURL=migrate.js.map