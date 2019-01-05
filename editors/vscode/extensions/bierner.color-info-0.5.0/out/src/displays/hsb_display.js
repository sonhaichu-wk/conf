"use strict";
var convert = require('color-convert');
var display_helper_1 = require('./display_helper');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new (function () {
    function HsbDisplay() {
        this.name = 'hsb';
    }
    HsbDisplay.prototype.display = function (match) {
        var _a = match.color.toHsv(), h = _a.h, s = _a.s, a = _a.a;
        return display_helper_1.func('hsb', display_helper_1.deg(h, 5), display_helper_1.percent(s, 5), display_helper_1.percent(b, 5));
    };
    return HsbDisplay;
}());
//# sourceMappingURL=hsb_display.js.map