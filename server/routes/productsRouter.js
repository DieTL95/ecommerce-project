"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var productsController_ts_1 = require("../controllers/productsController.ts");
var validationMiddleware_ts_1 = require("../middleware/validationMiddleware.ts");
var productSchema_ts_1 = require("../schemas/productSchema.ts");
var reqSchemas_ts_1 = require("../schemas/reqSchemas.ts");
var router = (0, express_1.Router)();
router
    .route("/")
    .get(productsController_ts_1.getAllProducts)
    .post((0, validationMiddleware_ts_1.validateData)(productSchema_ts_1.productSchema), productsController_ts_1.createProduct);
router
    .route("/:id")
    .get((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), productsController_ts_1.getOneProduct)
    .patch(productsController_ts_1.updateProduct)
    .delete((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), productsController_ts_1.deleteProduct);
router
    .route("/:id/images")
    .patch((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), productsController_ts_1.updateProductImages);
exports.default = router;
