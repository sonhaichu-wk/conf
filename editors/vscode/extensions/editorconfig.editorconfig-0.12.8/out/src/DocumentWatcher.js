var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const editorconfig = require("editorconfig");
const compact = require("lodash.compact");
const get = require("lodash.get");
const path = require("path");
const vscode_1 = require("vscode");
const languageExtensionMap_1 = require("./languageExtensionMap");
const Utils_1 = require("./Utils");
const transformations_1 = require("./transformations");
class DocumentWatcher {
    constructor(outputChannel = vscode_1.window.createOutputChannel('EditorConfig')) {
        this.outputChannel = outputChannel;
        this.preSaveTransformations = [
            new transformations_1.SetEndOfLine(),
            new transformations_1.TrimTrailingWhitespace(),
            new transformations_1.InsertFinalNewline()
        ];
        this.log('Initializing document watcher...');
        const subscriptions = [];
        subscriptions.push(vscode_1.window.onDidChangeActiveTextEditor(editor => {
            if (editor && editor.document) {
                this.resolveConfig(this.doc = editor.document);
            }
        }));
        subscriptions.push(vscode_1.window.onDidChangeWindowState(state => {
            if (state.focused && this.doc) {
                this.resolveConfig(this.doc);
            }
        }));
        subscriptions.push(vscode_1.workspace.onDidChangeConfiguration(this.onConfigChanged.bind(this)));
        subscriptions.push(vscode_1.workspace.onDidSaveTextDocument(doc => {
            if (path.basename(doc.fileName) === '.editorconfig') {
                this.log('.editorconfig file saved.');
                this.onConfigChanged();
            }
        }));
        subscriptions.push(vscode_1.workspace.onWillSaveTextDocument((e) => __awaiter(this, void 0, void 0, function* () {
            let selections;
            const activeEditor = vscode_1.window.activeTextEditor;
            const activeDoc = get(activeEditor, 'document');
            if (activeDoc && activeDoc === e.document) {
                selections = vscode_1.window.activeTextEditor.selections;
            }
            const transformations = this.calculatePreSaveTransformations(e.document, e.reason);
            e.waitUntil(transformations);
            if (selections) {
                yield transformations;
                activeEditor.selections = selections;
            }
        })));
        this.disposable = vscode_1.Disposable.from.apply(this, subscriptions);
        this.onConfigChanged();
    }
    log(...messages) {
        this.outputChannel.appendLine(messages.join(' '));
    }
    dispose() {
        this.disposable.dispose();
    }
    getSettingsForDocument(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (doc.languageId === 'Log') {
                return {};
            }
            const fileName = this.getFileName(doc);
            const relativePath = vscode_1.workspace.asRelativePath(fileName, true);
            this.log(`${relativePath}: Using EditorConfig core...`);
            const config = yield editorconfig.parse(fileName);
            if (config.indent_size === 'tab') {
                config.indent_size = config.tab_width;
            }
            return config;
        });
    }
    getFileName(doc) {
        if (!doc.isUntitled) {
            return doc.fileName;
        }
        const ext = languageExtensionMap_1.default[doc.languageId] || doc.languageId;
        return path.join(...compact([
            vscode_1.workspace.getWorkspaceFolder(doc.uri),
            `${doc.fileName}.${ext}`
        ]));
    }
    getDefaultSettings() {
        return this.defaults;
    }
    resolveConfig(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const editor = vscode_1.window.activeTextEditor;
            if (!editor) {
                this.log('No more open editors.');
                return;
            }
            const relativePath = vscode_1.workspace.asRelativePath(doc.fileName, true);
            const editorconfigSettings = yield this.getSettingsForDocument(doc);
            if (!editorconfigSettings) {
                this.log(`${relativePath}: No configuration.`);
                return;
            }
            const newOptions = Utils_1.fromEditorConfig(editorconfigSettings, this.getDefaultSettings());
            // tslint:disable-next-line:no-any
            editor.options = newOptions;
            this.log(`${relativePath}: ${JSON.stringify(newOptions)}`);
        });
    }
    onConfigChanged() {
        const workspaceConfig = vscode_1.workspace.getConfiguration('editor', null);
        const detectIndentation = workspaceConfig.get('detectIndentation');
        this.defaults = (detectIndentation) ? {} : {
            tabSize: workspaceConfig.get('tabSize'),
            insertSpaces: workspaceConfig.get('insertSpaces')
        };
        this.log('Detected change in configuration:', JSON.stringify(this.defaults));
    }
    calculatePreSaveTransformations(doc, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const editorconfigSettings = yield this.getSettingsForDocument(doc);
            const relativePath = vscode_1.workspace.asRelativePath(doc.fileName);
            if (!editorconfigSettings) {
                this.log(`${relativePath}: No configuration found for pre-save.`);
                return [];
            }
            return Array.prototype.concat.call([], ...this.preSaveTransformations.map(transformer => {
                const { edits, message } = transformer.transform(editorconfigSettings, doc, reason);
                if (edits instanceof Error) {
                    this.log(`${relativePath}: ${edits.message}`);
                }
                if (message) {
                    this.log(`${relativePath}: ${message}`);
                }
                return edits;
            }));
        });
    }
}
exports.default = DocumentWatcher;
//# sourceMappingURL=DocumentWatcher.js.map