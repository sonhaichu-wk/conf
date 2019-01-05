"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const opn = require("opn");
const azureRegistryNodes_1 = require("../models/azureRegistryNodes");
function browseAzurePortal(node) {
    if (node) {
        const tenantId = node.subscription.tenantId;
        const session = node.azureAccount.sessions.find((s, i, array) => s.tenantId.toLowerCase() === tenantId.toLowerCase());
        let url = `${session.environment.portalUrl}/${tenantId}/#resource${node.registry.id}`;
        if (node.contextValue === azureRegistryNodes_1.AzureImageTagNode.contextValue || node.contextValue === azureRegistryNodes_1.AzureRepositoryNode.contextValue) {
            url = `${url}/repository`;
        }
        opn(url);
    }
}
exports.browseAzurePortal = browseAzurePortal;
//# sourceMappingURL=browseAzurePortal.js.map