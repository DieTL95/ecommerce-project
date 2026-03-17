"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var frontpageController_ts_1 = require("../controllers/frontpageController.ts");
var validationMiddleware_ts_1 = require("../middleware/validationMiddleware.ts");
var reqSchemas_ts_1 = require("../schemas/reqSchemas.ts");
var router = (0, express_1.Router)();
router.route("/").get(frontpageController_ts_1.getFrontpage).post(frontpageController_ts_1.createFrontpage);
router.route("/current").get(frontpageController_ts_1.getCurrentFrontpage);
router
    .route("/:id")
    .get((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), frontpageController_ts_1.getOneFrontpage)
    .patch((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), frontpageController_ts_1.updatePage)
    .delete((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), frontpageController_ts_1.deletePage);
exports.default = router;
