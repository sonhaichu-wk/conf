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
const vscode_1 = require("vscode");
const entity = require("./entity");
const faker_factory_1 = require("./faker-factory");
const address = new entity.Address();
const commerce = new entity.Commerce();
const company = new entity.Company();
const database = new entity.Database();
const date = new entity.Date();
const finance = new entity.Finance();
const git = new entity.Git();
const hacker = new entity.Hacker();
const image = new entity.Image();
const internet = new entity.Internet();
const lorem = new entity.Lorem();
const name = new entity.Name();
const phone = new entity.Phone();
const random = new entity.Random();
const system = new entity.System();
const time = new entity.Time();
const vehicle = new entity.Vehicle();
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const configLocale = vscode_1.workspace
            .getConfiguration('faker')
            .get('locale');
        const faker = yield faker_factory_1.fakerFactory(configLocale);
        const fakerEntities = [
            address,
            commerce,
            company,
            database,
            date,
            finance,
            git,
            hacker,
            image,
            internet,
            lorem,
            name,
            phone,
            random,
            system,
            time,
            vehicle,
        ];
        for (const entity of fakerEntities) {
            const entityName = entity.getName();
            context.subscriptions.push(vscode_1.commands.registerCommand(`faker.${entityName}`, () => executeFaker(faker, entity)));
        }
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
/**
 * Get vscode active editor
 */
function getEditor() {
    const editor = vscode_1.window.activeTextEditor;
    if (!editor) {
        return;
    }
    return editor;
}
/**
 * Insert text in editor
 */
function insertText(editor, generateFakeFn) {
    const { selections } = editor;
    editor.edit((editBuilder) => {
        selections.forEach((selection) => {
            const { start, end } = selection;
            const range = new vscode_1.Range(start, end);
            const value = generateFakeFn().toString();
            editBuilder.replace(range, value);
        });
    });
}
function executeFaker(faker, fakerEntity) {
    return __awaiter(this, void 0, void 0, function* () {
        const selectedMethod = yield vscode_1.window.showQuickPick(fakerEntity.getMethods());
        if (!selectedMethod) {
            return;
        }
        const generateFakeFn = faker[fakerEntity.getName()][selectedMethod];
        insertText(getEditor(), generateFakeFn);
    });
}
//# sourceMappingURL=extension.js.map