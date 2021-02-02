"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const GitService_1 = require("./utils/GitService");
const createOpenEditorCommand_1 = require("./commands/createOpenEditorCommand");
const createCopyFromSCMInputBoxCommand_1 = require("./commands/createCopyFromSCMInputBoxCommand");
const createLoadTemplateCommand_1 = require("./commands/createLoadTemplateCommand");
function activate(context) {
    const git = new GitService_1.default();
    let currentPanel = undefined;
    context.subscriptions.push(createOpenEditorCommand_1.default({ context, currentPanel, git }));
    context.subscriptions.push(createCopyFromSCMInputBoxCommand_1.default({ currentPanel, git }));
    context.subscriptions.push(createLoadTemplateCommand_1.default({ currentPanel }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map