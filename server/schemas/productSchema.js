"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
var zod_1 = require("zod");
var mimeTypes = ["image/png", "image/jpeg", "image/jpg"];
exports.productSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string().min(5, "Enter a valid product name.").max(200, "Too much"),
        description: zod_1.default
            .string()
            .min(5, "To change it later")
            .max(1000, "Too much pal"),
        price: zod_1.default.preprocess(function (val) { return Number(val); }, zod_1.default
            .number()
            .positive("has to be a positive number")
            .max(9999999, "exceeds maximum")
            .min(0)),
        categories: zod_1.default.array(zod_1.default.object()).optional().nullable().nullish(),
        images: zod_1.default.array(zod_1.default.object()).optional().nullable().nullish(),
        details: zod_1.default
            .object({
            material: zod_1.default.string().optional(),
            origin: zod_1.default.string().optional(),
        })
            .optional(),
    }),
});
