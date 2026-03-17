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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOneOrder = exports.createOrder = exports.getAllOrders = void 0;
var database_ts_1 = require("../database.ts");
var customErrors_ts_1 = require("../errors/customErrors.ts");
var postgres_1 = require("kysely/helpers/postgres");
var getAllOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user) {
                    throw new customErrors_ts_1.UnauthorisedError("");
                }
                return [4 /*yield*/, database_ts_1.db
                        .selectFrom("orders")
                        .where("orders.user_id", "=", req.user.id)
                        .selectAll("orders")
                        .leftJoinLateral(function (eb) {
                        return eb
                            .selectFrom("order_items")
                            .whereRef("order_items.order_id", "=", "orders.id")
                            .leftJoin("products", function (join) {
                            return join.onRef("products.id", "=", "order_items.product_id");
                        })
                            .select(function (_a) {
                            var fn = _a.fn, ref = _a.ref, table = _a.table;
                            return fn
                                .jsonAgg((0, postgres_1.jsonBuildObject)({
                                id: ref("order_items.id"),
                                quantity: ref("order_items.quantity"),
                                price: ref("order_items.price"),
                                product: table("products"),
                            }))
                                .as("order_items");
                        })
                            .groupBy("order_id")
                            .as("order_items");
                    }, function (join) { return join.onTrue(); })
                        .select("order_items.order_items")
                        .execute()];
            case 1:
                orders = _a.sent();
                return [2 /*return*/, res.status(200).json(orders)];
        }
    });
}); };
exports.getAllOrders = getAllOrders;
var createOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .transaction()
                    .execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                    var userAddress, _a, order, order_items;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!req.body.user_id) return [3 /*break*/, 2];
                                return [4 /*yield*/, database_ts_1.db
                                        .selectFrom("addresses")
                                        .where("addresses.user_id", "=", req.body.user_id)
                                        .select("addresses.id")
                                        .executeTakeFirst()];
                            case 1:
                                _a = _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                _a = undefined;
                                _b.label = 3;
                            case 3:
                                userAddress = _a;
                                return [4 /*yield*/, trx
                                        .insertInto("orders")
                                        .values({
                                        value: req.body.value,
                                        user_id: req.body.user_id,
                                        address_id: (userAddress === null || userAddress === void 0 ? void 0 : userAddress.id) || req.body.address_id,
                                    })
                                        .returning("id")
                                        .executeTakeFirstOrThrow()];
                            case 4:
                                order = _b.sent();
                                order_items = req.body.order_items;
                                order_items.forEach(function (item) { return (item.order_id = order.id); });
                                return [4 /*yield*/, trx
                                        .insertInto("order_items")
                                        .values(__spreadArray([], order_items, true))
                                        .returningAll()
                                        .execute()];
                            case 5:
                                _b.sent();
                                return [2 /*return*/, order.id];
                        }
                    });
                }); })
                    .catch(function (err) {
                    console.log(err);
                    throw new customErrors_ts_1.BadRequestError("Couldn't create order.");
                })];
            case 1:
                transaction = _a.sent();
                console.log(transaction);
                return [2 /*return*/, res.json({ message: "Order placed.", body: transaction })];
        }
    });
}); };
exports.createOrder = createOrder;
var getOneOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .selectFrom("orders")
                    .where("orders.id", "=", req.params.id)
                    .selectAll("orders")
                    .leftJoinLateral(function (eb) {
                    return eb
                        .selectFrom("order_items")
                        .whereRef("order_items.order_id", "=", "orders.id")
                        .leftJoin("products", function (join) {
                        return join.onRef("products.id", "=", "order_items.product_id");
                    })
                        .select(function (_a) {
                        var fn = _a.fn, ref = _a.ref, table = _a.table;
                        return fn
                            .jsonAgg((0, postgres_1.jsonBuildObject)({
                            id: ref("order_items.id"),
                            quantity: ref("order_items.quantity"),
                            price: ref("order_items.price"),
                            product: table("products"),
                        }))
                            .as("order_items");
                    })
                        .groupBy("order_id")
                        .as("order_items");
                }, function (join) { return join.onTrue(); })
                    .select("order_items.order_items")
                    .executeTakeFirst()];
            case 1:
                order = _a.sent();
                return [2 /*return*/, res.status(200).json(order)];
        }
    });
}); };
exports.getOneOrder = getOneOrder;
var updateOrderStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .updateTable("orders")
                    .where("orders.id", "=", req.params.id)
                    .set({ status: req.body.status })
                    .returningAll()
                    .executeTakeFirst()];
            case 1:
                order = _a.sent();
                return [2 /*return*/, res.status(200).json(order)];
        }
    });
}); };
exports.updateOrderStatus = updateOrderStatus;
