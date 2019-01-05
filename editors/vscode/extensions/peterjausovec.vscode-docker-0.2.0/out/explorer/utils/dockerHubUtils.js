"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const opn = require("opn");
const vscode = require("vscode");
const constants_1 = require("../../constants");
const extensionVariables_1 = require("../../extensionVariables");
const dockerHubNodes_1 = require("../models/dockerHubNodes");
let _token;
async function dockerHubLogout() {
    if (extensionVariables_1.ext.keytar) {
        await extensionVariables_1.ext.keytar.deletePassword(constants_1.keytarConstants.serviceId, constants_1.keytarConstants.dockerHubTokenKey);
        await extensionVariables_1.ext.keytar.deletePassword(constants_1.keytarConstants.serviceId, constants_1.keytarConstants.dockerHubPasswordKey);
        await extensionVariables_1.ext.keytar.deletePassword(constants_1.keytarConstants.serviceId, constants_1.keytarConstants.dockerHubUserNameKey);
    }
    _token = null;
}
exports.dockerHubLogout = dockerHubLogout;
async function dockerHubLogin() {
    const username = await vscode.window.showInputBox({ ignoreFocusOut: true, prompt: 'Please enter your Docker ID to log in to Docker Hub' });
    if (username) {
        const password = await vscode.window.showInputBox({ ignoreFocusOut: true, prompt: 'Please enter your Docker Hub password', password: true });
        if (password) {
            _token = await login(username, password);
            if (_token) {
                return { username: username, password: password, token: _token.token };
            }
        }
    }
    return;
}
exports.dockerHubLogin = dockerHubLogin;
function setDockerHubToken(token) {
    _token = { token: token };
}
exports.setDockerHubToken = setDockerHubToken;
async function login(username, password) {
    let t;
    let options = {
        method: 'POST',
        uri: 'https://hub.docker.com/v2/users/login',
        body: {
            username: username,
            password: password
        },
        json: true
    };
    try {
        t = await extensionVariables_1.ext.request(options);
    }
    catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(error.error.detail);
    }
    return t;
}
async function getUser() {
    let u;
    let options = {
        method: 'GET',
        uri: 'https://hub.docker.com/v2/user/',
        headers: {
            Authorization: 'JWT ' + _token.token
        },
        json: true
    };
    try {
        u = await extensionVariables_1.ext.request(options);
    }
    catch (error) {
        console.log(error);
        if (error.statusCode === 401) {
            vscode.window.showErrorMessage('Docker: Please logout of DockerHub and then log in again.');
        }
    }
    return u;
}
exports.getUser = getUser;
async function getRepositories(username) {
    let repos;
    let options = {
        method: 'GET',
        uri: `https://hub.docker.com/v2/users/${username}/repositories/`,
        headers: {
            Authorization: 'JWT ' + _token.token
        },
        json: true
    };
    try {
        repos = await extensionVariables_1.ext.request(options);
    }
    catch (error) {
        console.log(error);
        vscode.window.showErrorMessage('Docker: Unable to retrieve Repositories');
    }
    return repos;
}
exports.getRepositories = getRepositories;
async function getRepositoryInfo(repository) {
    let res;
    let options = {
        method: 'GET',
        uri: `https://hub.docker.com/v2/repositories/${repository.namespace}/${repository.name}/`,
        headers: {
            Authorization: 'JWT ' + _token.token
        },
        json: true
    };
    try {
        res = await extensionVariables_1.ext.request(options);
    }
    catch (error) {
        console.log(error);
        vscode.window.showErrorMessage('Docker: Unable to get Repository Details');
    }
    return res;
}
exports.getRepositoryInfo = getRepositoryInfo;
async function getRepositoryTags(repository) {
    let tagsPage;
    let options = {
        method: 'GET',
        uri: `https://hub.docker.com/v2/repositories/${repository.namespace}/${repository.name}/tags?page_size=${constants_1.PAGE_SIZE}&page=1`,
        headers: {
            Authorization: 'JWT ' + _token.token
        },
        json: true
    };
    try {
        tagsPage = await extensionVariables_1.ext.request(options);
    }
    catch (error) {
        console.log(error);
        vscode.window.showErrorMessage('Docker: Unable to retrieve Repository Tags');
    }
    return tagsPage.results;
}
exports.getRepositoryTags = getRepositoryTags;
function browseDockerHub(node) {
    if (node) {
        let url = 'https://hub.docker.com/';
        if (node instanceof dockerHubNodes_1.DockerHubOrgNode) {
            url = `${url}u/${node.userName}`;
        }
        else if (node instanceof dockerHubNodes_1.DockerHubRepositoryNode) {
            url = `${url}r/${node.repository.namespace}/${node.repository.name}`;
        }
        else if (node instanceof dockerHubNodes_1.DockerHubImageTagNode) {
            url = `${url}r/${node.repository.namespace}/${node.repository.name}/tags`;
        }
        else {
            assert(false, `browseDockerHub: Unexpected node type, contextValue=${node.contextValue}`);
        }
        opn(url);
    }
}
exports.browseDockerHub = browseDockerHub;
//# sourceMappingURL=dockerHubUtils.js.map