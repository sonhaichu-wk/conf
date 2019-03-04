'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function activate(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand('markdown.extension.editing.toggleBold', toggleBold), vscode_1.commands.registerCommand('markdown.extension.editing.toggleItalic', toggleItalic), vscode_1.commands.registerCommand('markdown.extension.editing.toggleCodeSpan', toggleCodeSpan), vscode_1.commands.registerCommand('markdown.extension.editing.toggleStrikethrough', toggleStrikethrough), vscode_1.commands.registerCommand('markdown.extension.editing.toggleMath', toggleMath), vscode_1.commands.registerCommand('markdown.extension.editing.toggleHeadingUp', toggleHeadingUp), vscode_1.commands.registerCommand('markdown.extension.editing.toggleHeadingDown', toggleHeadingDown), vscode_1.commands.registerCommand('markdown.extension.editing.toggleUnorderedList', toggleUnorderedList), vscode_1.commands.registerCommand('markdown.extension.editing.paste', paste));
}
exports.activate = activate;
// Return Promise because need to chain operations in unit tests
function toggleBold() {
    return styleByWrapping('**');
}
function toggleItalic() {
    let indicator = vscode_1.workspace.getConfiguration('markdown.extension.italic').get('indicator');
    return styleByWrapping(indicator);
}
function toggleCodeSpan() {
    return styleByWrapping('`');
}
function toggleStrikethrough() {
    return styleByWrapping('~~');
}
function toggleHeadingUp() {
    return __awaiter(this, void 0, void 0, function* () {
        let editor = vscode_1.window.activeTextEditor;
        let lineIndex = editor.selection.active.line;
        let lineText = editor.document.lineAt(lineIndex).text;
        return yield editor.edit((editBuilder) => {
            if (!lineText.startsWith('#')) { // Not a heading
                editBuilder.insert(new vscode_1.Position(lineIndex, 0), '# ');
            }
            else if (!lineText.startsWith('######')) { // Already a heading (but not level 6)
                editBuilder.insert(new vscode_1.Position(lineIndex, 0), '#');
            }
        });
    });
}
function toggleHeadingDown() {
    let editor = vscode_1.window.activeTextEditor;
    let lineIndex = editor.selection.active.line;
    let lineText = editor.document.lineAt(lineIndex).text;
    editor.edit((editBuilder) => {
        if (lineText.startsWith('# ')) { // Heading level 1
            editBuilder.delete(new vscode_1.Range(new vscode_1.Position(lineIndex, 0), new vscode_1.Position(lineIndex, 2)));
        }
        else if (lineText.startsWith('#')) { // Heading (but not level 1)
            editBuilder.delete(new vscode_1.Range(new vscode_1.Position(lineIndex, 0), new vscode_1.Position(lineIndex, 1)));
        }
    });
}
function toggleMath() {
    let editor = vscode_1.window.activeTextEditor;
    if (!editor.selection.isEmpty)
        return;
    let cursor = editor.selection.active;
    if (getContext(editor, cursor, '$') === '$|$') {
        return editor.edit(editBuilder => {
            editBuilder.replace(new vscode_1.Range(cursor.line, cursor.character - 1, cursor.line, cursor.character + 1), '$$  $$');
        }).then(() => {
            let pos = cursor.with({ character: cursor.character + 2 });
            editor.selection = new vscode_1.Selection(pos, pos);
        });
    }
    else if (getContext(editor, cursor, '$$ ', ' $$') === '$$ | $$') {
        return editor.edit(editBuilder => {
            editBuilder.delete(new vscode_1.Range(cursor.line, cursor.character - 3, cursor.line, cursor.character + 3));
        });
    }
    else {
        return vscode_1.commands.executeCommand('editor.action.insertSnippet', { snippet: '$$0$' });
    }
}
function toggleUnorderedList() {
    let editor = vscode_1.window.activeTextEditor;
    if (!editor.selection.isEmpty)
        return;
    let cursor = editor.selection.active;
    let textBeforeCursor = editor.document.lineAt(cursor.line).text.substr(0, cursor.character);
    let indentation = 0;
    switch (textBeforeCursor.trim()) {
        case '':
            return editor.edit(editBuilder => {
                editBuilder.insert(cursor, '- ');
            });
        case '-':
            indentation = textBeforeCursor.indexOf('-');
            return editor.edit(editBuilder => {
                editBuilder.replace(new vscode_1.Range(cursor.line, indentation, cursor.line, cursor.character), '*' + ' '.repeat(textBeforeCursor.length - indentation - 1));
            });
        case '*':
            indentation = textBeforeCursor.indexOf('*');
            return editor.edit(editBuilder => {
                editBuilder.replace(new vscode_1.Range(cursor.line, indentation, cursor.line, cursor.character), '+' + ' '.repeat(textBeforeCursor.length - indentation - 1));
            });
        case '+':
            indentation = textBeforeCursor.indexOf('+');
            return editor.edit(editBuilder => {
                editBuilder.delete(new vscode_1.Range(cursor.line, indentation, cursor.line, cursor.character));
            });
    }
}
function paste() {
    return vscode_1.env.clipboard.readText().then(text => {
        if (/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(text)) {
            return vscode_1.commands.executeCommand("editor.action.insertSnippet", { "snippet": `[$TM_SELECTED_TEXT$0](${text})` });
        }
        else {
            return vscode_1.commands.executeCommand("editor.action.clipboardPasteAction");
        }
    });
}
function styleByWrapping(startPattern, endPattern) {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }
    let editor = vscode_1.window.activeTextEditor;
    let selections = editor.selections;
    let batchEdit = new vscode_1.WorkspaceEdit();
    let shifts = [];
    let newSelections = selections.slice();
    selections.forEach((selection, i) => {
        let cursorPos = selection.active;
        const shift = shifts.map(([pos, s]) => (selection.start.line == pos.line && selection.start.character >= pos.character) ? s : 0)
            .reduce((a, b) => a + b, 0);
        if (selection.isEmpty) {
            // No selected text
            if (startPattern !== '~~' && getContext(editor, cursorPos, startPattern) === `${startPattern}text|${endPattern}`) {
                // `**text|**` to `**text**|`
                let newCursorPos = cursorPos.with({ character: cursorPos.character + shift + endPattern.length });
                newSelections[i] = new vscode_1.Selection(newCursorPos, newCursorPos);
                return;
            }
            else if (getContext(editor, cursorPos, startPattern) === `${startPattern}|${endPattern}`) {
                // `**|**` to `|`
                let start = cursorPos.with({ character: cursorPos.character - startPattern.length });
                let end = cursorPos.with({ character: cursorPos.character + endPattern.length });
                wrapRange(editor, batchEdit, shifts, newSelections, i, shift, cursorPos, new vscode_1.Range(start, end), false, startPattern);
            }
            else {
                // Select word under cursor
                let wordRange = editor.document.getWordRangeAtPosition(cursorPos);
                if (wordRange == undefined) {
                    wordRange = selection;
                }
                // One special case: toggle strikethrough in task list
                const currentTextLine = editor.document.lineAt(cursorPos.line);
                if (startPattern === '~~' && /^\s*[\*\+\-] (\[[ x]\] )? */g.test(currentTextLine.text)) {
                    wordRange = currentTextLine.range.with(new vscode_1.Position(cursorPos.line, currentTextLine.text.match(/^\s*[\*\+\-] (\[[ x]\] )? */g)[0].length));
                }
                wrapRange(editor, batchEdit, shifts, newSelections, i, shift, cursorPos, wordRange, false, startPattern);
            }
        }
        else {
            // Text selected
            wrapRange(editor, batchEdit, shifts, newSelections, i, shift, cursorPos, selection, true, startPattern);
        }
    });
    return vscode_1.workspace.applyEdit(batchEdit).then(() => {
        editor.selections = newSelections;
    });
}
/**
 * Add or remove `startPattern`/`endPattern` according to the context
 * @param editor
 * @param options The undo/redo behavior
 * @param cursor cursor position
 * @param range range to be replaced
 * @param isSelected is this range selected
 * @param startPtn
 * @param endPtn
 */
function wrapRange(editor, wsEdit, shifts, newSelections, i, shift, cursor, range, isSelected, startPtn, endPtn) {
    if (endPtn == undefined) {
        endPtn = startPtn;
    }
    let text = editor.document.getText(range);
    const prevSelection = newSelections[i];
    const ptnLength = (startPtn + endPtn).length;
    let newCursorPos = cursor.with({ character: cursor.character + shift });
    let newSelection;
    if (isWrapped(text, startPtn)) {
        // remove start/end patterns from range
        wsEdit.replace(editor.document.uri, range, text.substr(startPtn.length, text.length - ptnLength));
        shifts.push([range.end, -ptnLength]);
        // Fix cursor position
        if (!isSelected) {
            if (!range.isEmpty) { // means quick styling
                if (cursor.character == range.end.character) {
                    newCursorPos = cursor.with({ character: cursor.character + shift - ptnLength });
                }
                else {
                    newCursorPos = cursor.with({ character: cursor.character + shift - startPtn.length });
                }
            }
            else { // means `**|**` -> `|`
                newCursorPos = cursor.with({ character: cursor.character + shift + startPtn.length });
            }
            newSelection = new vscode_1.Selection(newCursorPos, newCursorPos);
        }
        else {
            newSelection = new vscode_1.Selection(prevSelection.start.with({ character: prevSelection.start.character + shift }), prevSelection.end.with({ character: prevSelection.end.character + shift - ptnLength }));
        }
    }
    else {
        // add start/end patterns around range
        wsEdit.replace(editor.document.uri, range, startPtn + text + endPtn);
        shifts.push([range.end, ptnLength]);
        // Fix cursor position
        if (!isSelected) {
            if (!range.isEmpty) { // means quick styling
                if (cursor.character == range.end.character) {
                    newCursorPos = cursor.with({ character: cursor.character + shift + ptnLength });
                }
                else {
                    newCursorPos = cursor.with({ character: cursor.character + shift + startPtn.length });
                }
            }
            else { // means `|` -> `**|**`
                newCursorPos = cursor.with({ character: cursor.character + shift + startPtn.length });
            }
            newSelection = new vscode_1.Selection(newCursorPos, newCursorPos);
        }
        else {
            newSelection = new vscode_1.Selection(prevSelection.start.with({ character: prevSelection.start.character + shift }), prevSelection.end.with({ character: prevSelection.end.character + shift + ptnLength }));
        }
    }
    newSelections[i] = newSelection;
}
function isWrapped(text, startPattern, endPattern) {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }
    return text.startsWith(startPattern) && text.endsWith(endPattern);
}
function getContext(editor, cursorPos, startPattern, endPattern) {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }
    let startPositionCharacter = cursorPos.character - startPattern.length;
    let endPositionCharacter = cursorPos.character + endPattern.length;
    if (startPositionCharacter < 0) {
        startPositionCharacter = 0;
    }
    let leftText = editor.document.getText(new vscode_1.Range(cursorPos.line, startPositionCharacter, cursorPos.line, cursorPos.character));
    let rightText = editor.document.getText(new vscode_1.Range(cursorPos.line, cursorPos.character, cursorPos.line, endPositionCharacter));
    if (rightText == endPattern) {
        if (leftText == startPattern) {
            return `${startPattern}|${endPattern}`;
        }
        else {
            return `${startPattern}text|${endPattern}`;
        }
    }
    return '|';
}
//# sourceMappingURL=formatting.js.map