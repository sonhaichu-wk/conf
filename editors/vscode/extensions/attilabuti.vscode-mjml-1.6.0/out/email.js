"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const vscode_1 = require("vscode");
const mime_1 = require("mime");
const node_mailjet_1 = require("node-mailjet");
const nodemailer_1 = require("nodemailer");
const helper_1 = require("./helper");
class Email {
    constructor(subscriptions) {
        subscriptions.push(vscode_1.commands.registerCommand("mjml.sendEmail", () => {
            helper_1.renderMJML((content) => {
                this.sendEmail(content, helper_1.getPath());
            });
        }));
    }
    sendEmail(content, mjmlPath) {
        const mailer = vscode_1.workspace.getConfiguration("mjml").mailer.toLowerCase();
        const defaultRecipients = vscode_1.workspace.getConfiguration("mjml").mailRecipients;
        vscode_1.window.showInputBox({
            placeHolder: "Type a subject for the email.",
            prompt: "Subject",
            value: vscode_1.workspace.getConfiguration("mjml").mailSubject
        }).then((subject) => {
            if (!subject) {
                return;
            }
            vscode_1.window.showInputBox({
                placeHolder: "Comma-separated list of recipients.",
                prompt: "Recipients",
                value: defaultRecipients
            }).then((recipients) => __awaiter(this, void 0, void 0, function* () {
                if (!recipients) {
                    return;
                }
                yield vscode_1.window.withProgress({
                    cancellable: false,
                    location: vscode_1.ProgressLocation.Notification,
                    title: `Sending email...`
                }, () => __awaiter(this, void 0, void 0, function* () {
                    recipients = (recipients ? recipients : defaultRecipients).replace(/\s/g, "");
                    const attachments = this.createAttachments(content, mjmlPath, mailer);
                    content = this.replaceImages(content, attachments, mailer);
                    if (mailer === "nodemailer") {
                        yield this.nodemailer(subject, recipients, content, attachments);
                    }
                    else {
                        yield this.mailjet(subject, recipients, content, attachments);
                    }
                }));
            }));
        });
    }
    nodemailer(subject, recipients, html, attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            const transportOptions = vscode_1.workspace.getConfiguration("mjml").nodemailer;
            yield nodemailer_1.createTransport(transportOptions).sendMail({
                attachments,
                from: {
                    address: vscode_1.workspace.getConfiguration("mjml").mailSender,
                    name: vscode_1.workspace.getConfiguration("mjml").mailFromName
                },
                html,
                subject,
                to: recipients
            }).then((info) => {
                vscode_1.window.showInformationMessage("Mail has been sent successfully.");
                if (transportOptions.host && transportOptions.host === "smtp.ethereal.email") {
                    const url = nodemailer_1.getTestMessageUrl(info);
                    if (url) {
                        vscode_1.window.showInformationMessage(`Preview URL: ${url}`);
                    }
                }
            }).catch((error) => {
                if (error) {
                    vscode_1.window.showErrorMessage(error.message);
                    return;
                }
            });
        });
    }
    mailjet(subject, recipients, html, attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipientList = recipients.split(",").map((emailAddress) => {
                return { Email: emailAddress };
            });
            yield node_mailjet_1.connect(vscode_1.workspace.getConfiguration("mjml").mailjetAPIKey, vscode_1.workspace.getConfiguration("mjml").mailjetAPISecret).post("send").request({
                "FromEmail": vscode_1.workspace.getConfiguration("mjml").mailSender,
                "FromName": vscode_1.workspace.getConfiguration("mjml").mailFromName,
                "Html-part": html,
                "Inline_attachments": attachments,
                "Recipients": recipientList,
                "Subject": subject
            }).then(() => {
                vscode_1.window.showInformationMessage("Mail has been sent successfully.");
            }).catch((error) => {
                vscode_1.window.showErrorMessage(error.message);
            });
        });
    }
    createAttachments(content, mjmlPath, mailer) {
        const imgPaths = [];
        let match;
        const pattern = /<img\s+[^>]*?src=("|')([^"']+)\1/g;
        while (match = pattern.exec(content)) {
            imgPaths.push(match[2]);
        }
        const attachments = [];
        if (!imgPaths) {
            return attachments;
        }
        for (let i = 0; i < imgPaths.length; i++) {
            if (imgPaths[i] && !isURL(imgPaths[i])) {
                const filePath = path_1.join(path_1.dirname(mjmlPath), imgPaths[i]);
                if (filePath && fs_1.existsSync(filePath) && fs_1.statSync(filePath).isFile()) {
                    if (mailer === "nodemailer") {
                        attachments.push({
                            cid: Math.random().toString(36).substring(2) + i,
                            content: fs_1.createReadStream(filePath),
                            filename: path_1.basename(filePath),
                            originalPath: imgPaths[i]
                        });
                    }
                    else {
                        attachments.push({
                            "Content-type": mime_1.getType(filePath),
                            "Filename": i + "_" + path_1.basename(filePath),
                            "content": fs_1.readFileSync(filePath).toString("base64"),
                            "originalPath": imgPaths[i]
                        });
                    }
                }
            }
        }
        return attachments;
    }
    replaceImages(content, attachments, mailer) {
        if (attachments) {
            for (const attachment of attachments) {
                content = content.replace(`src="${attachment.originalPath}"`, `src="cid:${((mailer === "nodemailer") ? attachment.cid : attachment.Filename)}"`);
            }
        }
        return content;
    }
}
exports.default = Email;
function isURL(url) {
    return new RegExp("^" +
        "(?:(?:(?:https?|ftp):)?\\/\\/)" +
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
        "(?:" +
        "(?:" +
        "[a-z0-9\\u00a1-\\uffff]" +
        "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
        ")?" +
        "[a-z0-9\\u00a1-\\uffff]\\." +
        ")+" +
        "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
        ")" +
        "(?::\\d{2,5})?" +
        "(?:[/?#]\\S*)?" +
        "$", "i").test(url);
}
//# sourceMappingURL=email.js.map