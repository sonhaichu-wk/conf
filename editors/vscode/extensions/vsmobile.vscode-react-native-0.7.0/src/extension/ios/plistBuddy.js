"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const glob = require("glob");
const node_1 = require("../../common/node/node");
class PlistBuddy {
    constructor({ nodeChildProcess = new node_1.Node.ChildProcess(), } = {}) {
        this.nodeChildProcess = nodeChildProcess;
    }
    getBundleId(projectRoot, simulator = true, configuration = "Debug", productName) {
        const productsFolder = path.join(projectRoot, "build", "Build", "Products");
        const configurationFolder = path.join(productsFolder, `${configuration}${simulator ? "-iphonesimulator" : "-iphoneos"}`);
        let executable = "";
        if (productName) {
            executable = `${productName}.app`;
        }
        else {
            const executableList = this.findExecutable(configurationFolder);
            if (!executableList.length) {
                throw new Error(`Could not found executable in ${configurationFolder}`);
            }
            else if (executableList.length > 1) {
                throw new Error(`Found more than one executables in ${configurationFolder}. Please cleanup build folder or setup 'productName' launch option.`);
            }
            executable = `${executableList[0]}`;
        }
        const infoPlistPath = path.join(configurationFolder, executable, "Info.plist");
        return this.invokePlistBuddy("Print:CFBundleIdentifier", infoPlistPath);
    }
    setPlistProperty(plistFile, property, value) {
        // Attempt to set the value, and if it fails due to the key not existing attempt to create the key
        return this.invokePlistBuddy(`Set ${property} ${value}`, plistFile).fail(() => this.invokePlistBuddy(`Add ${property} string ${value}`, plistFile)).then(() => { });
    }
    setPlistBooleanProperty(plistFile, property, value) {
        // Attempt to set the value, and if it fails due to the key not existing attempt to create the key
        return this.invokePlistBuddy(`Set ${property} ${value}`, plistFile)
            .fail(() => this.invokePlistBuddy(`Add ${property} bool ${value}`, plistFile))
            .then(() => { });
    }
    deletePlistProperty(plistFile, property) {
        return this.invokePlistBuddy(`Delete ${property}`, plistFile).then(() => { });
    }
    readPlistProperty(plistFile, property) {
        return this.invokePlistBuddy(`Print ${property}`, plistFile);
    }
    findExecutable(folder) {
        return glob.sync("*.app", {
            cwd: folder,
        });
    }
    invokePlistBuddy(command, plistFile) {
        return this.nodeChildProcess.exec(`${PlistBuddy.plistBuddyExecutable} -c '${command}' '${plistFile}'`).outcome.then((result) => {
            return result.toString().trim();
        });
    }
}
PlistBuddy.plistBuddyExecutable = "/usr/libexec/PlistBuddy";
exports.PlistBuddy = PlistBuddy;

//# sourceMappingURL=plistBuddy.js.map
