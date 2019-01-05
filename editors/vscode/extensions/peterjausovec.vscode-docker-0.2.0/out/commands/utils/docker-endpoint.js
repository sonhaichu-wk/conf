"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const Docker = require("dockerode");
const vscode = require("vscode");
var DockerEngineType;
(function (DockerEngineType) {
    DockerEngineType[DockerEngineType["Linux"] = 0] = "Linux";
    DockerEngineType[DockerEngineType["Windows"] = 1] = "Windows";
})(DockerEngineType = exports.DockerEngineType || (exports.DockerEngineType = {}));
class DockerClient {
    constructor() {
        this.refreshEndpoint();
    }
    refreshEndpoint() {
        const errorMessage = 'The docker.host configuration setting must be entered as <host>:<port>, e.g. dockerhost:2375';
        const value = vscode.workspace.getConfiguration("docker").get("host", "");
        if (value) {
            let newHost = '';
            let newPort = 2375;
            let sep = -1;
            sep = value.lastIndexOf(':');
            if (sep < 0) {
                vscode.window.showErrorMessage(errorMessage);
            }
            else {
                newHost = value.slice(0, sep);
                newPort = Number(value.slice(sep + 1));
                if (isNaN(newPort)) {
                    vscode.window.showErrorMessage(errorMessage);
                }
                else {
                    this.endPoint = new Docker({ host: newHost, port: newPort });
                }
            }
        }
        if (!this.endPoint || !value) {
            // Pass no options so that the defaultOpts of docker-modem will be used if the endpoint wasn't created
            // or the user went from configured setting to empty settign
            this.endPoint = new Docker();
        }
    }
    getContainerDescriptors(opts) {
        return new Promise((resolve, reject) => {
            if (!opts) {
                opts = {};
            }
            this.endPoint.listContainers(opts, (err, containers) => {
                if (err) {
                    return reject(err);
                }
                return resolve(containers);
            });
        });
    }
    ;
    getImageDescriptors(opts) {
        return new Promise((resolve, reject) => {
            if (!opts) {
                opts = {};
            }
            this.endPoint.listImages(opts, (err, images) => {
                if (err) {
                    return reject(err);
                }
                return resolve(images);
            });
        });
    }
    ;
    getContainer(id) {
        return this.endPoint.getContainer(id);
    }
    getEngineType() {
        if (process.platform === 'win32') {
            return new Promise((resolve, reject) => {
                this.endPoint.info((error, info) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(info.OSType === "windows" ? DockerEngineType.Windows : DockerEngineType.Linux);
                });
            });
        }
        // On Linux or macOS, this can only ever be linux,
        // so short-circuit the Docker call entirely.
        return Promise.resolve(DockerEngineType.Linux);
    }
    getEngineInfo() {
        return new Promise((resolve, reject) => {
            this.endPoint.info((error, info) => {
                if (error) {
                    return reject(error);
                }
                return resolve(info);
            });
        });
    }
    getExposedPorts(imageId) {
        return new Promise((resolve, reject) => {
            this.getImage(imageId).inspect((error, { Config: { ExposedPorts = {} } }) => {
                const ports = Object.keys(ExposedPorts);
                resolve(ports);
            });
        });
    }
    getImage(id) {
        return this.endPoint.getImage(id);
    }
}
exports.docker = new DockerClient();
//# sourceMappingURL=docker-endpoint.js.map