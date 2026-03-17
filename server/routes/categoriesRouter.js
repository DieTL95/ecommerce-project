"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var categoriesController_ts_1 = require("../controllers/categoriesController.ts");
var authMiddleware_ts_1 = require("../middleware/authMiddleware.ts");
var validationMiddleware_ts_1 = require("../middleware/validationMiddleware.ts");
var reqSchemas_ts_1 = require("../schemas/reqSchemas.ts");
var router = (0, express_1.Router)();
router.route("/").get(authMiddleware_ts_1.isAdminMiddleware, categoriesController_ts_1.getAllCategories).post(categoriesController_ts_1.createCategory);
router
    .route("/:id")
    .get((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), categoriesController_ts_1.getOneCategory)
    .patch((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), categoriesController_ts_1.updateCategory)
    .delete((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), categoriesController_ts_1.deleteCategory);
router
    .route("/:id/images")
    .patch((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), categoriesController_ts_1.updateCategoryImages);
router
    .route("/:id/products")
    .get(categoriesController_ts_1.getOneCategoryProducts)
    .post(categoriesController_ts_1.addCategoryToProduct)
    .delete(categoriesController_ts_1.removeCategoryFromProduct);
exports.default = router;
