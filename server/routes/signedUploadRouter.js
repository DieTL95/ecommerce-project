"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var signedUploadController_ts_1 = require("../controllers/signedUploadController.ts");
var router = (0, express_1.Router)();
router.route("/").get(signedUploadController_ts_1.signedUpload);
exports.default = router;
