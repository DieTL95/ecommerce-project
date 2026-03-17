"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var addressController_ts_1 = require("../controllers/addressController.ts");
var validationMiddleware_ts_1 = require("../middleware/validationMiddleware.ts");
var reqSchemas_ts_1 = require("../schemas/reqSchemas.ts");
var addressSchema_ts_1 = require("../schemas/addressSchema.ts");
var router = (0, express_1.Router)();
router
    .route("/")
    .get(addressController_ts_1.getAddresses)
    .post((0, validationMiddleware_ts_1.validateData)(addressSchema_ts_1.addressSchema), addressController_ts_1.createAddress);
router
    .route("/:id")
    .get((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), addressController_ts_1.getOneAddress)
    .patch((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), (0, validationMiddleware_ts_1.validateData)(addressSchema_ts_1.addressSchema), addressController_ts_1.updateAddress)
    .delete((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), addressController_ts_1.deleteAddress);
exports.default = router;
