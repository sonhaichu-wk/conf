"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const os_1 = require("os");
const createPostMessage_1 = require("../utils/createPostMessage");
const EditorTab_1 = require("../webviews/EditorTab");
const getExtensionConfig_1 = require("../utils/getExtensionConfig");
const createOpenEditorCommand = ({ context, currentPanel, git, }) => {
    return vscode.commands.registerCommand('commitMessageEditor.openEditor', () => {
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        const populateCommitList = () => {
            git
                .getRecentCommitMessages(10)
                .then(commits => {
                const message = createPostMessage_1.default('recentCommitMessages', { commits });
                if (currentPanel) {
                    currentPanel.webview.postMessage(message);
                }
            })
                .catch(er => {
                vscode.window.showErrorMessage('Something went wrong', er);
            });
        };
        const confirmAmend = (payload) => __awaiter(void 0, void 0, void 0, function* () {
            const confirmAmend = vscode.workspace.getConfiguration('commit-message-editor').get('confirmAmend');
            if (!confirmAmend) {
                performAmend(payload);
                return;
            }
            const labelOk = 'Yes';
            const labelAlways = 'Always';
            const selected = yield vscode.window.showWarningMessage('Are you sure want to continue? Your last commit will be undone.', { modal: true }, labelOk, labelAlways);
            if ([labelOk, labelAlways].includes(selected)) {
                performAmend(payload);
            }
            if (selected === labelAlways) {
                vscode.workspace.getConfiguration('commit-message-editor').update('confirmAmend', false, vscode.ConfigurationTarget.Global);
            }
        });
        const performAmend = (commitMessage) => __awaiter(void 0, void 0, void 0, function* () {
            yield vscode.commands.executeCommand('git.undoCommit');
            git.setSCMInputBoxMessage(commitMessage);
            populateCommitList();
            if (currentPanel) {
                currentPanel.webview.postMessage(createPostMessage_1.default('amendPerformed'));
            }
        });
        if (currentPanel) {
            currentPanel.reveal(columnToShowIn);
            return;
        }
        currentPanel = vscode.window.createWebviewPanel('editCommitMessage', 'Edit commit message', columnToShowIn, {
            enableScripts: true,
        });
        const { webview } = currentPanel;
        const { extensionPath } = context;
        const defaultView = String(vscode.workspace.getConfiguration('commit-message-editor.view').get('defaultView'));
        const showRecentCommits = Boolean(vscode.workspace.getConfiguration('commit-message-editor.view').get('showRecentCommits'));
        const saveAndClose = Boolean(vscode.workspace.getConfiguration('commit-message-editor.view').get('saveAndClose'));
        currentPanel.webview.html = EditorTab_1.default({
            extensionPath,
            webview,
            platform: os_1.platform(),
            defaultView,
            showRecentCommits,
            saveAndClose,
        });
        currentPanel.webview.onDidReceiveMessage(data => {
            const { command, payload } = data;
            switch (command) {
                case 'copyFromExtensionMessageBox':
                    git.setSCMInputBoxMessage(payload);
                    break;
                case 'closeTab':
                    currentPanel.dispose();
                    break;
                case 'requestConfig':
                    currentPanel.webview.postMessage(createPostMessage_1.default('receiveConfig', getExtensionConfig_1.default()));
                    break;
                case 'requestRecentCommits':
                    populateCommitList();
                    break;
                case 'confirmAmend':
                    confirmAmend(payload);
                    break;
                default:
                    break;
            }
        }, undefined, context.subscriptions);
        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
        }, null, context.subscriptions);
        currentPanel.webview.postMessage(createPostMessage_1.default('copyFromSCMInputBox', {
            inputBoxValue: git.getSCMInputBoxMessage(),
        }));
    });
};
exports.default = createOpenEditorCommand;
//# sourceMappingURL=createOpenEditorCommand.js.map