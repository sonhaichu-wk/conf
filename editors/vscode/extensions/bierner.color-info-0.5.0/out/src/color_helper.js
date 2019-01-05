"use strict";
var vscode = require('vscode');
var tinycolor = require("tinycolor2");
/**
 * Extract all matches for a given regular expression on a line
 */
var getRegExForLine = function (re, lineNumber, line) {
    var matches = [];
    var match;
    while ((match = re.exec(line))) {
        var color = tinycolor(match[0]);
        if (color && color.isValid()) {
            var span = new vscode.Range(new vscode.Position(lineNumber, match.index), new vscode.Position(lineNumber, match.index + match[0].length));
            matches.push({
                value: match[0],
                color: color,
                span: span
            });
        }
    }
    return matches;
};
/**
 * Get all `rgb(...)` colors in a line of text.
 */
var getRgbColorForLine = function (lineNumber, line) {
    return getRegExForLine(/rgba?\(.+?\)/g, lineNumber, line);
};
/**
 * Get all `hsl(...)` colors in a line of text.
 */
var getHslColorsForLine = function (lineNumber, line) {
    return getRegExForLine(/hsla?\(.+?\)/g, lineNumber, line);
};
/**
 * Get all color values in a line of text.
 */
var getColorsForLine = function (position, line) {
    return [].concat(getRgbColorForLine(position.line, line), getHslColorsForLine(position.line, line));
};
/**
 * Get the color at `position` in a line of text
 */
exports.getColorAtPosition = function (position, line) {
    var allColors = getColorsForLine(position, line)
        .filter(function (x) { return x.span.contains(position); });
    return allColors[0];
};
//# sourceMappingURL=color_helper.js.map