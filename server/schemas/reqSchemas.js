"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramSchema = void 0;
var zod_1 = require("zod");
exports.paramSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.uuidv4("Invalid parameter ID."),
    }),
});
