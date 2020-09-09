"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileNameWithoutExtension = void 0;
const path = require("path");
function getFileNameWithoutExtension(fileName) {
    return path.basename(fileName, path.extname(fileName));
}
exports.getFileNameWithoutExtension = getFileNameWithoutExtension;

//# sourceMappingURL=utils.js.map
