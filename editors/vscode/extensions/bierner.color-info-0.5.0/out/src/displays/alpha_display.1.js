"use strict";
var display_helper_1 = require('./display_helper');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new (function () {
    function RgbDisplay() {
        this.name = 'alpha';
    }
    RgbDisplay.prototype.display = function (match) {
        var a = match.color.toRgb().a;
        return display_helper_1.func('alpha', display_helper_1.decimalPercent(a, 0));
    };
    return RgbDisplay;
}());
//# sourceMappingURL=alpha_display.1.js.map