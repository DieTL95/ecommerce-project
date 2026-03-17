"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
var zod_1 = require("zod");
exports.addressSchema = zod_1.default.object({
    body: zod_1.default.object({
        label: zod_1.default
            .string("Enter a valid")
            .min(2, "To change it later")
            .max(500, "Too much pal"),
        full_name: zod_1.default
            .string("Enter a valid")
            .min(2, "Enter a valid full name.")
            .max(50, "Too much"),
        email: zod_1.default.email("Enter a valid email to receive tracking number"),
        address_one: zod_1.default
            .string("Enter a valid")
            .min(2, "Enter a valid address.")
            .max(50, "Too much"),
        address_two: zod_1.default
            .string("Enter a valid")
            .min(2, "Enter a valid street name.")
            .max(50, "Too much"),
        country: zod_1.default
            .string("Enter a valid")
            .min(2, "Enter a valid country.")
            .max(50, "Too much"),
        province: zod_1.default
            .string("Enter a valid")
            .min(2, "Enter a valid province.")
            .max(50, "Too much"),
        city: zod_1.default
            .string("Enter a valid")
            .min(2, "Enter a valid city.")
            .max(50, "Too much"),
        phonenumber: zod_1.default.number().positive("has to be a positive number"),
        zipcode: zod_1.default.string("Enter a valid").min(3, "Enter a valid zipcode."),
    })
});
