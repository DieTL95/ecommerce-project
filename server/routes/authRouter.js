"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var passport_1 = require("passport");
var usersController_ts_1 = require("../controllers/usersController.ts");
var validationMiddleware_ts_1 = require("../middleware/validationMiddleware.ts");
var userSchema_ts_1 = require("../schemas/userSchema.ts");
var authMiddleware_ts_1 = require("../middleware/authMiddleware.ts");
var router = (0, express_1.Router)();
router.route("/register").post((0, validationMiddleware_ts_1.validateData)(userSchema_ts_1.userSchema), usersController_ts_1.createUser);
router.route("/login").post(passport_1.default.authenticate("local", {
    failureMessage: "Failed",
    failWithError: true,
    keepSessionInfo: true,
}));
router
    .route("/logout")
    .get(function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    });
    return res.status(200).json({ message: "Logged out." });
});
router
    .route("/is-auth")
    .get(authMiddleware_ts_1.isAuthMiddleware, function (req, res) {
    return res
        .status(200)
        .json({ user: __assign(__assign({}, req.user), { session_id: req.sessionID }) });
});
router
    .route("/is-admin")
    .get(authMiddleware_ts_1.isAdminMiddleware, function (req, res) {
    return res.status(200).json(req.user);
});
exports.default = router;
