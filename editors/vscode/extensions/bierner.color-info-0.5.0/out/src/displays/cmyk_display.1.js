"use strict";
var convert = require('color-convert');
var display_helper_1 = require('./display_helper');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new (function () {
    function CmykDisplay() {
        this.name = 'cmyk';
    }
    CmykDisplay.prototype.display = function (match) {
        var _a = match.color.toHsl(), h = _a.h, s = _a.s, l = _a.l, a = _a.a;
        var _b = convert.hsl.cmyk(h, s * 100, l * 100), c = _b[0], m = _b[1], y = _b[2], k = _b[3];
        return display_helper_1.func('cmyk', display_helper_1.percent(c, 5), display_helper_1.percent(m, 5), display_helper_1.percent(y, 5), display_helper_1.percent(k, 5));
    };
    return CmykDisplay;
}());
//# sourceMappingURL=cmyk_display.1.js.map