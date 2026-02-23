"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseDuration;
function parseDuration(v) {
    const m = /^([0-9]+)(s|m|h|d)$/.exec(v);
    if (!m)
        return 7 * 24 * 60 * 60 * 1000;
    const n = Number(m[1]);
    const unit = m[2];
    switch (unit) {
        case "s":
            return n * 1000;
        case "m":
            return n * 60 * 1000;
        case "h":
            return n * 60 * 60 * 1000;
        case "d":
            return n * 24 * 60 * 60 * 1000;
        default:
            return n;
    }
}
