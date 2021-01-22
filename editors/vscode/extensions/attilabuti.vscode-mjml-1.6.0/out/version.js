"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const vscode_1 = require("vscode");
class Version {
    constructor(subscriptions) {
        subscriptions.push(vscode_1.commands.registerCommand("mjml.version", () => {
            this.version();
        }));
    }
    version() {
        const filePath = path_1.join(__dirname, "../node_modules/mjml/package.json");
        if (filePath && fs_1.existsSync(filePath) && fs_1.statSync(filePath).isFile()) {
            try {
                const data = JSON.parse(fs_1.readFileSync(filePath, "utf8"));
                vscode_1.window.showInformationMessage(`MJML version: ${data.version}`);
            }
            catch (error) {
                vscode_1.window.showErrorMessage(error.message);
            }
        }
    }
}
exports.default = Version;
//# sourceMappingURL=version.js.map