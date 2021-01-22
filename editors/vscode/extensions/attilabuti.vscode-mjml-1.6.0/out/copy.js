"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const copy_paste_1 = require("copy-paste");
const helper_1 = require("./helper");
class Copy {
    constructor(subscriptions) {
        subscriptions.push(vscode_1.commands.registerCommand("mjml.copyHTML", () => {
            this.copy();
        }));
    }
    copy() {
        helper_1.renderMJML((content) => {
            copy_paste_1.copy(content, () => {
                vscode_1.window.showInformationMessage("Copied!");
            });
        });
    }
}
exports.default = Copy;
//# sourceMappingURL=copy.js.map