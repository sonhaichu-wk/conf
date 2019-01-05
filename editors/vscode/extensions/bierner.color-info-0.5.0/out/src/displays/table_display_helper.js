"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function () {
    var keys = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        keys[_i - 0] = arguments[_i];
    }
    return keys.map(function (pair) { return pair[0] + ':' + pair[1]; })
        .join(' ');
};
//# sourceMappingURL=table_display_helper.js.map