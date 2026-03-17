"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usersController_ts_1 = require("../controllers/usersController.ts");
var validationMiddleware_ts_1 = require("../middleware/validationMiddleware.ts");
var reqSchemas_ts_1 = require("../schemas/reqSchemas.ts");
var router = (0, express_1.Router)();
router.route("/").get(usersController_ts_1.getUsers).patch(usersController_ts_1.updateUser);
router
    .route("/:id")
    .get((0, validationMiddleware_ts_1.validateData)(reqSchemas_ts_1.paramSchema), usersController_ts_1.getOneUser)
    .delete(usersController_ts_1.deleteUser);
exports.default = router;
