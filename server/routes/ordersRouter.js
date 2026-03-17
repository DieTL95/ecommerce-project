"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ordersController_ts_1 = require("../controllers/ordersController.ts");
var router = (0, express_1.Router)();
router.route("/").get(ordersController_ts_1.getAllOrders).post(ordersController_ts_1.createOrder);
router.route("/:id").get(ordersController_ts_1.getOneOrder).patch(ordersController_ts_1.updateOrderStatus);
exports.default = router;
