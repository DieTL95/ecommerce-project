"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getOneUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
var database_ts_1 = require("../database.ts");
var customErrors_ts_1 = require("../errors/customErrors.ts");
var bcrypt_1 = require("bcrypt");
var getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db.selectFrom("users").selectAll("users").execute()];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res.json(users || "No users available")];
        }
    });
}); };
exports.getUsers = getUsers;
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPass, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, bcrypt_1.hash)(req.body.password, 10)];
            case 1:
                hashedPass = _a.sent();
                req.body.password = hashedPass;
                return [4 /*yield*/, database_ts_1.db
                        .insertInto("users")
                        .values(req.body)
                        .returningAll()
                        .executeTakeFirstOrThrow()
                        .catch(function (err) {
                        throw new customErrors_ts_1.BadRequestError(err.message);
                    })];
            case 2:
                user = _a.sent();
                if (!!req.session.cart_id) return [3 /*break*/, 4];
                return [4 /*yield*/, database_ts_1.db
                        .insertInto("cart")
                        .values({
                        user_id: user.id,
                    })
                        .execute()];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, database_ts_1.db
                    .updateTable("cart")
                    .where("cart.id", "=", req.session.cart_id)
                    .set({ user_id: user.id })
                    .execute()];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/, res.json({ message: "Congrats", body: user })];
        }
    });
}); };
exports.createUser = createUser;
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user) {
                    throw new customErrors_ts_1.UnauthorisedError("");
                }
                return [4 /*yield*/, database_ts_1.db
                        .updateTable("users")
                        .where("id", "=", req.user.id)
                        .set(req.body)
                        .returningAll()
                        .executeTakeFirstOrThrow()
                        .catch(function () { return new customErrors_ts_1.BadRequestError("Couldn't update user."); })];
            case 1:
                updatedUser = _a.sent();
                return [2 /*return*/, res.status(200).json(updatedUser)];
        }
    });
}); };
exports.updateUser = updateUser;
var getOneUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .selectFrom("users")
                    .selectAll()
                    .where("id", "=", req.params.id)
                    .execute()
                    .catch(function () {
                    throw new customErrors_ts_1.BadRequestError("Couldn't find user.");
                })];
            case 1:
                user = _a.sent();
                if (user.length === 0) {
                    return [2 /*return*/, res.status(200).json({ message: "User doesn't exist." })];
                }
                return [2 /*return*/, res.status(200).json({ user: user })];
        }
    });
}); };
exports.getOneUser = getOneUser;
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .deleteFrom("users")
                    .where("id", "=", req.params.id)
                    .executeTakeFirst()
                    .catch(function () { return new customErrors_ts_1.BadRequestError("Couldn't delete user."); })];
            case 1:
                _a.sent();
                return [2 /*return*/, res.json({ message: "User deleted." })];
        }
    });
}); };
exports.deleteUser = deleteUser;
