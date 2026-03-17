"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var paymentsController_ts_1 = require("../controllers/paymentsController.ts");
var router = (0, express_1.Router)();
router.route("/payment-intent").post(paymentsController_ts_1.payment);
exports.default = router;
