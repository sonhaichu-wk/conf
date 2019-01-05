"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const fs = require("fs");
const os = require("os");
const vscode = require("vscode");
const imageNode_1 = require("../explorer/models/imageNode");
const extensionVariables_1 = require("../extensionVariables");
const telemetry_1 = require("../telemetry/telemetry");
const docker_endpoint_1 = require("./utils/docker-endpoint");
const quick_pick_image_1 = require("./utils/quick-pick-image");
const teleCmdId = 'vscode-docker.container.start';
/**
 * Image -> Run
 */
async function startContainer(actionContext, context) {
    return await startContainerCore(actionContext, context, false);
}
exports.startContainer = startContainer;
async function startContainerCore(actionContext, context, interactive) {
    let imageName;
    let imageToStart;
    if (context instanceof imageNode_1.ImageNode && context.imageDesc) {
        imageToStart = context.imageDesc;
        imageName = context.label;
    }
    else {
        const selectedItem = await quick_pick_image_1.quickPickImage(actionContext, false);
        if (selectedItem) {
            imageToStart = selectedItem.imageDesc;
            imageName = selectedItem.label;
        }
    }
    if (imageToStart) {
        docker_endpoint_1.docker.getExposedPorts(imageToStart.Id).then((ports) => {
            let options = `--rm ${interactive ? '-it' : '-d'}`;
            if (ports.length) {
                const portMappings = ports.map((port) => `-p ${port.split("/")[0]}:${port}`); //'port' is of the form number/protocol, eg. 8080/udp.
                // In the command, the host port has just the number (mentioned in the EXPOSE step), while the destination port can specify the protocol too
                options += ` ${portMappings.join(' ')}`;
            }
            const terminal = extensionVariables_1.ext.terminalProvider.createTerminal(imageName);
            terminal.sendText(`docker run ${options} ${imageName}`);
            terminal.show();
            if (telemetry_1.reporter) {
                /* __GDPR__
                   "command" : {
                      "command" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                   }
                 */
                telemetry_1.reporter.sendTelemetryEvent('command', {
                    command: interactive ? teleCmdId + '.interactive' : teleCmdId
                });
            }
        });
    }
}
exports.startContainerCore = startContainerCore;
/**
 * Image -> Run Interactive
 */
async function startContainerInteractive(actionContext, context) {
    await startContainerCore(actionContext, context, true);
}
exports.startContainerInteractive = startContainerInteractive;
async function startAzureCLI() {
    // block of we are running windows containers...
    const engineType = await docker_endpoint_1.docker.getEngineType();
    if (engineType === docker_endpoint_1.DockerEngineType.Windows) {
        const selected = await vscode.window.showErrorMessage('Currently, you can only run the Azure CLI when running Linux based containers.', {
            title: 'More Information',
        }, {
            title: 'Close',
            isCloseAffordance: true
        });
        if (!selected || selected.isCloseAffordance) {
            return;
        }
        return cp.exec('start https://docs.docker.com/docker-for-windows/#/switch-between-windows-and-linux-containers');
    }
    else {
        const option = process.platform === 'linux' ? '--net=host' : '';
        // volume map .azure folder so don't have to log in every time
        const homeDir = process.platform === 'win32' ? os.homedir().replace(/\\/g, '/') : os.homedir();
        let vol = '';
        if (fs.existsSync(`${homeDir}/.azure`)) {
            vol += ` -v ${homeDir}/.azure:/root/.azure`;
        }
        if (fs.existsSync(`${homeDir}/.ssh`)) {
            vol += ` -v ${homeDir}/.ssh:/root/.ssh`;
        }
        if (fs.existsSync(`${homeDir}/.kube`)) {
            vol += ` -v ${homeDir}/.kube:/root/.kube`;
        }
        const cmd = `docker run ${option} ${vol.trim()} -it --rm azuresdk/azure-cli-python:latest`;
        const terminal = vscode.window.createTerminal('Azure CLI');
        terminal.sendText(cmd);
        terminal.show();
        if (telemetry_1.reporter) {
            /* __GDPR__
               "command" : {
                  "command" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
               }
             */
            telemetry_1.reporter.sendTelemetryEvent('command', {
                command: teleCmdId + '.azurecli'
            });
        }
    }
}
exports.startAzureCLI = startAzureCLI;
//# sourceMappingURL=start-container.js.map