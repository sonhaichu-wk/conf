"use strict";
var vscode = require("vscode");
var color_extractor_1 = require("./color_extractor");
var rgb_display_1 = require("./displays/rgb_display");
var hsl_display_1 = require("./displays/hsl_display");
var hsv_display_1 = require("./displays/hsv_display");
var cmyk_display_1 = require("./displays/cmyk_display");
var lab_display_1 = require("./displays/lab_display");
var alpha_display_1 = require("./displays/alpha_display");
var hex_display_1 = require("./displays/hex_display");
var preview_display_1 = require("./displays/preview_display");
var allFields = [
    preview_display_1.Preview, preview_display_1.PreviewXL, preview_display_1.PreviewSquare, preview_display_1.PreviewSquareXL,
    rgb_display_1.default,
    hsl_display_1.default,
    hsv_display_1.default,
    cmyk_display_1.default,
    lab_display_1.default,
    alpha_display_1.default,
    hex_display_1.default
].reduce(function (p, display) {
    p[display.name] = display;
    return p;
}, {});
var defaultFields = [
    preview_display_1.Preview.name,
    rgb_display_1.default.name,
    hsl_display_1.default.name,
    cmyk_display_1.default.name,
    hex_display_1.default.name,
    alpha_display_1.default.name
];
/**
 * Normalize the name of a color field
 */
var normalizeFieldName = function (name) {
    return ('' + name).toLowerCase();
};
/**
 *
 */
var getDisplays = function () {
    var fields = (vscode.workspace.getConfiguration('colorInfo').get('fields') || defaultFields).map(normalizeFieldName);
    var excluded = (vscode.workspace.getConfiguration('colorInfo').get('excludedFields') || []).map(normalizeFieldName);
    fields = fields.filter(function (name) { return excluded.indexOf(name) === -1; });
    return fields
        .map(function (x) { return allFields[x]; })
        .filter(function (x) { return x; });
};
var getDisplay = function (match) {
    return getDisplays().map(function (x) { return x.display(match); })
        .filter(function (x) { return x && x.length > 0; })
        .join('\n\n');
};
/**
 * Color info hover provider
 */
var ColorInfoHoverProvider = (function () {
    function ColorInfoHoverProvider() {
    }
    ColorInfoHoverProvider.prototype.provideHover = function (document, position, token) {
        var line = document.lineAt(position.line);
        var match = color_extractor_1.getColorAtPosition(position, line.text);
        if (match) {
            var display = getDisplay(match);
            if (display && display.length)
                return new vscode.Hover(display);
        }
        return null;
    };
    return ColorInfoHoverProvider;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColorInfoHoverProvider;
//# sourceMappingURL=color_info_hover_provider.js.map