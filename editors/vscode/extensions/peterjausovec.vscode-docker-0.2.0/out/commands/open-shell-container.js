"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const containerNode_1 = require("../explorer/models/containerNode");
const extensionVariables_1 = require("../extensionVariables");
const telemetry_1 = require("../telemetry/telemetry");
const docker_endpoint_1 = require("./utils/docker-endpoint");
const quick_pick_container_1 = require("./utils/quick-pick-container");
const teleCmdId = 'vscode-docker.container.open-shell';
const configOptions = vscode.workspace.getConfiguration('docker');
const engineTypeShellCommands = {
    [docker_endpoint_1.DockerEngineType.Linux]: configOptions.get('attachShellCommand.linuxContainer', '/bin/sh'),
    [docker_endpoint_1.DockerEngineType.Windows]: configOptions.get('attachShellCommand.windowsContainer', 'powershell')
};
async function openShellContainer(actionContext, context) {
    let containerToAttach;
    if (context instanceof containerNode_1.ContainerNode && context.containerDesc) {
        containerToAttach = context.containerDesc;
    }
    else {
        const opts = {
            "filters": {
                "status": ["running"]
            }
        };
        const selectedItem = await quick_pick_container_1.quickPickContainer(actionContext, false, opts);
        if (selectedItem) {
            containerToAttach = selectedItem.containerDesc;
        }
    }
    if (containerToAttach) {
        docker_endpoint_1.docker.getEngineType().then((engineType) => {
            const terminal = extensionVariables_1.ext.terminalProvider.createTerminal(`Shell: ${containerToAttach.Image}`);
            terminal.sendText(`docker exec -it ${containerToAttach.Id} ${engineTypeShellCommands[engineType]}`);
            terminal.show();
            if (telemetry_1.reporter) {
                /* __GDPR__
                   "command" : {
                      "command" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                      "dockerEngineType": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                   }
                 */
                telemetry_1.reporter.sendTelemetryEvent('command', {
                    command: teleCmdId,
                    dockerEngineType: engineTypeShellCommands[engineType]
                });
            }
        });
    }
}
exports.openShellContainer = openShellContainer;
//# sourceMappingURL=open-shell-container.js.map