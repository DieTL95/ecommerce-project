"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlJSON = sqlJSON;
var kysely_1 = require("kysely");
function sqlJSON(object) {
    return (0, kysely_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["(", "::jsonb)"], ["(", "::jsonb)"])), JSON.stringify(object));
}
var templateObject_1;
