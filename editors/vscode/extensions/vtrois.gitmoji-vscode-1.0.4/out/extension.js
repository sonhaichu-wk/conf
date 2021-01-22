"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const gitmoji_1 = require("./gitmoji/gitmoji");
function activate(context) {
    let disposable = vscode.commands.registerCommand("extension.Gitmoji", (uri) => {
        const git = getGitExtension();
        const language = getEnvLanguage();
        if (!git) {
            vscode.window.showErrorMessage("Unable to load Git Extension");
            return;
        }
        let additionalEmojis = vscode.workspace.getConfiguration().get("gitmoji.additionalEmojis") ||
            [];
        const showEmojiCode = vscode.workspace.getConfiguration().get("gitmoji.showEmojiCode");
        let emojis = [];
        let onlyUseAdditionalEmojis = vscode.workspace
            .getConfiguration()
            .get("gitmoji.onlyUseAdditionalEmojis");
        if (onlyUseAdditionalEmojis === true) {
            emojis = [...additionalEmojis];
        }
        else {
            emojis = [...gitmoji_1.default, ...additionalEmojis];
        }
        const items = emojis.map((emojiObj) => {
            const { description, description_zh_cn, code, emoji } = emojiObj;
            const displayDescription = language === "zh-cn"
                ? description_zh_cn || description
                : description;
            const displayCode = showEmojiCode
                ? code
                : '';
            const label = `${emoji} ${displayDescription} ${displayCode}`;
            return {
                label,
                code,
                emoji
            };
        });
        vscode.window.showQuickPick(items).then(function (selected) {
            if (selected) {
                vscode.commands.executeCommand("workbench.view.scm");
                let outputType = vscode.workspace
                    .getConfiguration()
                    .get("gitmoji.outputType");
                if (uri) {
                    let selectedRepository = git.repositories.find((repository) => {
                        return repository.rootUri.path === uri._rootUri.path;
                    });
                    if (selectedRepository) {
                        if (outputType === "emoji") {
                            prefixCommit(selectedRepository, selected.emoji);
                        }
                        else {
                            prefixCommit(selectedRepository, selected.code);
                        }
                    }
                }
                else {
                    for (let repo of git.repositories) {
                        if (outputType === "emoji") {
                            prefixCommit(repo, selected.emoji);
                        }
                        else {
                            prefixCommit(repo, selected.code);
                        }
                    }
                }
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function getEnvLanguage() {
    const language = vscode.env.language;
    return language;
}
function prefixCommit(repository, prefix) {
    repository.inputBox.value = `${prefix} ${repository.inputBox.value}`;
}
function getGitExtension() {
    const vscodeGit = vscode.extensions.getExtension("vscode.git");
    const gitExtension = vscodeGit && vscodeGit.exports;
    return gitExtension && gitExtension.getAPI(1);
}
function deactivate() { }
exports.deactivate = deactivate;
