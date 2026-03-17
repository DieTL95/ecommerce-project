"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cartController_ts_1 = require("../controllers/cartController.ts");
var router = (0, express_1.Router)();
router
    .route("/")
    .get(cartController_ts_1.getCurrentCart)
    .post(cartController_ts_1.createCart)
    .patch(cartController_ts_1.updateCart)
    .delete(cartController_ts_1.clearCart);
router
    .route("/:id")
    .get(cartController_ts_1.getCartById)
    .post(cartController_ts_1.addItemToCart)
    .delete(cartController_ts_1.deleteCartItem);
exports.default = router;
