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
class GitService {
    constructor() {
        this.isGitAvailable = false;
        this.gitExtension = vscode.extensions.getExtension('vscode.git');
        if (!this.gitExtension) {
            return;
        }
        this.isGitAvailable = true;
        this.api = this.gitExtension.exports.getAPI(1);
    }
    getSelectedRepository(repos) {
        return repos.find((repo) => repo.ui.selected);
    }
    isAvailable() {
        return this.isGitAvailable;
    }
    getSCMInputBoxMessage() {
        const repo = this.getSelectedRepository(this.api.repositories);
        if (repo) {
            return repo.inputBox.value;
        }
        return '';
    }
    setSCMInputBoxMessage(message) {
        const repo = this.getSelectedRepository(this.api.repositories);
        if (repo) {
            repo.inputBox.value = message;
        }
    }
    getRecentCommitMessages(limit = 32) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.getSelectedRepository(this.api.repositories);
            let log;
            if (!repo) {
                return Promise.resolve([]);
            }
            try {
                log = yield repo.log({ maxEntries: limit });
            }
            catch (er) {
                Promise.reject(er);
            }
            if (!log) {
                return Promise.resolve([]);
            }
            return Promise.resolve(log);
        });
    }
}
exports.default = GitService;
//# sourceMappingURL=GitService.js.map