"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
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
exports.ExperimentService = exports.ExperimentStatuses = void 0;
const Configstore = require("configstore");
const https = require("https");
const vscode = require("vscode");
const promise_1 = require("../../common/node/promise");
const telemetryHelper_1 = require("../../common/telemetryHelper");
const telemetry_1 = require("../../common/telemetry");
var ExperimentStatuses;
(function (ExperimentStatuses) {
    ExperimentStatuses["ENABLED"] = "enabled";
    ExperimentStatuses["DISABLED"] = "disabled";
    ExperimentStatuses["FAILED"] = "failed";
})(ExperimentStatuses = exports.ExperimentStatuses || (exports.ExperimentStatuses = {}));
class ExperimentService {
    constructor() {
        this.endpointURL = "https://microsoft.github.io/vscode-react-native/experiments/experimentsConfig.json";
        this.configName = "reactNativeToolsConfig";
        this.promiseUtil = new promise_1.PromiseUtil();
        this.config = new Configstore(this.configName);
        this.cancellationTokenSource = new vscode.CancellationTokenSource();
        this.downloadedExperimentsConfig = null;
        this.downloadConfigRequest = this.retryDownloadExperimentsConfig();
    }
    static create() {
        if (!ExperimentService.instance) {
            ExperimentService.instance = new ExperimentService();
        }
        return ExperimentService.instance;
    }
    runExperiments() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.downloadedExperimentsConfig) {
                this.downloadedExperimentsConfig = yield this.downloadConfigRequest;
                this.experimentsInstances = yield this.initializeExperimentsInstances();
            }
            let experimentResults = yield Promise.all(this.downloadedExperimentsConfig.map(expConfig => this.executeExperiment(expConfig)));
            this.sendExperimentTelemetry(experimentResults);
        });
    }
    dispose() {
        this.cancellationTokenSource.cancel();
        this.cancellationTokenSource.dispose();
    }
    executeExperiment(expConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            let curExperimentParameters = this.config.get(expConfig.experimentName);
            let expInstance = this.experimentsInstances.get(expConfig.experimentName);
            let expResult;
            if (expInstance && expConfig.enabled) {
                try {
                    expResult = yield expInstance.run(expConfig, curExperimentParameters);
                    this.config.set(expConfig.experimentName, expResult.updatedExperimentParameters);
                }
                catch (err) {
                    expResult = {
                        resultStatus: ExperimentStatuses.FAILED,
                        updatedExperimentParameters: expConfig,
                        error: err,
                    };
                }
            }
            else {
                expResult = {
                    resultStatus: ExperimentStatuses.DISABLED,
                    updatedExperimentParameters: expConfig,
                };
            }
            return expResult;
        });
    }
    retryDownloadExperimentsConfig(retryCount = 60) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.downloadExperimentsConfig();
            }
            catch (err) {
                if (retryCount < 1 || this.cancellationTokenSource.token.isCancellationRequested) {
                    throw err;
                }
                yield this.promiseUtil.delay(2000);
                return yield this.retryDownloadExperimentsConfig(--retryCount);
            }
        });
    }
    initializeExperimentsInstances() {
        return __awaiter(this, void 0, void 0, function* () {
            let expInstances = new Map();
            if (this.downloadedExperimentsConfig) {
                for (let expConfig of this.downloadedExperimentsConfig) {
                    try {
                        let expClass = yield Promise.resolve().then(() => require(`./experiments/${expConfig.experimentName}`));
                        expInstances.set(expConfig.experimentName, new expClass.default());
                    }
                    catch (err) {
                        expConfig.enabled = false;
                    }
                }
            }
            return expInstances;
        });
    }
    downloadExperimentsConfig() {
        return new Promise((resolve, reject) => {
            https.get(this.endpointURL, (response) => {
                let data = "";
                response.setEncoding("utf8");
                response.on("data", (chunk) => (data += chunk));
                response.on("end", () => {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (err) {
                        reject(err);
                    }
                });
                response.on("error", reject);
            }).on("error", reject);
        });
    }
    sendExperimentTelemetry(experimentsResults) {
        const runExperimentsEvent = telemetryHelper_1.TelemetryHelper.createTelemetryEvent("runExperiments");
        experimentsResults.forEach(expResult => {
            if (expResult.resultStatus === ExperimentStatuses.FAILED
                && expResult.error) {
                telemetryHelper_1.TelemetryHelper.addTelemetryEventErrorProperty(runExperimentsEvent, expResult.error, undefined, `${expResult.updatedExperimentParameters.experimentName}.`);
            }
            else {
                telemetryHelper_1.TelemetryHelper.addTelemetryEventProperty(runExperimentsEvent, expResult.updatedExperimentParameters.experimentName, expResult.resultStatus, false);
            }
        });
        telemetry_1.Telemetry.send(runExperimentsEvent);
    }
}
exports.ExperimentService = ExperimentService;

//# sourceMappingURL=experimentService.js.map
