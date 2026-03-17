"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signatureForm = void 0;
var cloudinary_1 = require("cloudinary");
var customErrors_ts_1 = require("../errors/customErrors.ts");
var signatureForm = function () {
    var apiSecret = cloudinary_1.v2.config().api_secret;
    if (!apiSecret) {
        throw new customErrors_ts_1.UnauthorisedError("");
    }
    var timestamp = Math.round(new Date().getTime() / 1000);
    var signature = cloudinary_1.v2.utils.api_sign_request({
        timestamp: timestamp,
    }, apiSecret);
    return { timestamp: timestamp, signature: signature };
};
exports.signatureForm = signatureForm;
