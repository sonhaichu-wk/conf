"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const azure_arm_resource_1 = require("azure-arm-resource");
class NotSignedInError extends Error {
}
exports.NotSignedInError = NotSignedInError;
class CredentialError extends Error {
}
exports.CredentialError = CredentialError;
class AzureAccountWrapper {
    constructor(extensionConext, azureAccount) {
        this.extensionConext = extensionConext;
        this.accountApi = azureAccount;
    }
    getAzureSessions() {
        const status = this.signInStatus;
        if (status !== 'LoggedIn') {
            throw new NotSignedInError(status);
        }
        return this.accountApi.sessions;
    }
    getCredentialByTenantId(tenantId) {
        const session = this.getAzureSessions().find((s, i, array) => s.tenantId.toLowerCase() === tenantId.toLowerCase());
        if (session) {
            return session.credentials;
        }
        throw new CredentialError(`Failed to get credential, tenant ${tenantId} not found.`);
    }
    get signInStatus() {
        return this.accountApi.status;
    }
    getFilteredSubscriptions() {
        return this.accountApi.filters.map(filter => {
            return {
                id: filter.subscription.id,
                subscriptionId: filter.subscription.subscriptionId,
                tenantId: filter.session.tenantId,
                displayName: filter.subscription.displayName,
                state: filter.subscription.state,
                subscriptionPolicies: filter.subscription.subscriptionPolicies,
                authorizationSource: filter.subscription.authorizationSource
            };
        });
    }
    async getAllSubscriptions() {
        return this.accountApi.subscriptions.map(({ session, subscription }) => (Object.assign({ tenantId: session.tenantId }, subscription)));
    }
    async getLocationsBySubscription(subscription) {
        const credential = this.getCredentialByTenantId(subscription.tenantId);
        const client = new azure_arm_resource_1.SubscriptionClient(credential);
        const locations = (await client.subscriptions.listLocations(subscription.subscriptionId));
        return locations;
    }
    registerSessionsChangedListener(listener, thisArg) {
        return this.accountApi.onSessionsChanged(listener, thisArg, this.extensionConext.subscriptions);
    }
    registerFiltersChangedListener(listener, thisArg) {
        return this.accountApi.onFiltersChanged(listener, thisArg, this.extensionConext.subscriptions);
    }
}
exports.AzureAccountWrapper = AzureAccountWrapper;
//# sourceMappingURL=azureAccountWrapper.js.map