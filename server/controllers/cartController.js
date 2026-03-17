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
exports.clearCart = exports.deleteCartItem = exports.updateCart = exports.addItemToCart = exports.getCartItems = exports.getCartById = exports.getCurrentCart = exports.createCart = exports.getAllCarts = void 0;
var database_ts_1 = require("../database.ts");
var postgres_1 = require("kysely/helpers/postgres");
var customErrors_ts_1 = require("../errors/customErrors.ts");
var getAllCarts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cart;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db.selectFrom("cart").selectAll().execute()];
            case 1:
                cart = _a.sent();
                if (!cart) {
                    return [2 /*return*/, res.status(400).json({ message: "Request error" })];
                }
                return [2 /*return*/, res.status(200).json(cart)];
        }
    });
}); };
exports.getAllCarts = getAllCarts;
var createCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, cart;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                body = {
                    userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                    session_id: req.sessionID,
                };
                return [4 /*yield*/, database_ts_1.db
                        .insertInto("cart")
                        .values(body)
                        .returningAll()
                        .executeTakeFirstOrThrow(function (er) { return new Error("Cart creation failed.", { cause: er }); })];
            case 1:
                cart = _b.sent();
                if (!cart) return [3 /*break*/, 3];
                return [4 /*yield*/, database_ts_1.db
                        .updateTable("session")
                        .where("sid", "=", req.sessionID)
                        .set({ sess: { cart_id: cart.id, cookie: req.session.cookie } })
                        .executeTakeFirstOrThrow(function (er) { return new Error("Adding cart_id to session failed.", { cause: er }); })];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [2 /*return*/, res.status(201).json({ message: "Cart created.", body: cart })];
        }
    });
}); };
exports.createCart = createCart;
var getCurrentCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cart;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .selectFrom("cart")
                    .selectAll("cart")
                    .where("cart.id", "=", req.user ? req.user.cart_id : req.session.cart_id)
                    .leftJoinLateral(function (eb) {
                    return eb
                        .selectFrom("cart_items")
                        .whereRef("cart_items.cart_id", "=", "cart.id")
                        .leftJoin("products", function (join) {
                        return join.onRef("products.id", "=", "cart_items.product_id");
                    })
                        .select(function (_a) {
                        var fn = _a.fn, ref = _a.ref, table = _a.table;
                        return fn
                            .jsonAgg((0, postgres_1.jsonBuildObject)({
                            id: ref("cart_items.id"),
                            quantity: ref("cart_items.quantity"),
                            price: ref("cart_items.price"),
                            total_price: ref("cart_items.total_price"),
                            product: table("products"),
                        }))
                            .as("cart_items");
                    })
                        .groupBy("cart_id")
                        .as("cart_items");
                }, function (join) { return join.onTrue(); })
                    .select("cart_items.cart_items")
                    .executeTakeFirst()];
            case 1:
                cart = _a.sent();
                return [2 /*return*/, res.status(200).json(cart)];
        }
    });
}); };
exports.getCurrentCart = getCurrentCart;
var getCartById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cart;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .selectFrom("cart")
                    .where("cart.id", "=", req.params.id)
                    .selectAll("cart")
                    .leftJoinLateral(function (eb) {
                    return eb
                        .selectFrom("cart_items")
                        .whereRef("cart_items.cart_id", "=", "cart.id")
                        .leftJoin("products", function (join) {
                        return join.onRef("products.id", "=", "cart_items.product_id");
                    })
                        .select(function (_a) {
                        var fn = _a.fn, ref = _a.ref, table = _a.table;
                        return fn
                            .jsonAgg((0, postgres_1.jsonBuildObject)({
                            id: ref("cart_items.id"),
                            quantity: ref("cart_items.quantity"),
                            price: ref("cart_items.price"),
                            total_price: ref("cart_items.total_price"),
                            product: table("products"),
                        }))
                            .as("cart_items");
                    })
                        .groupBy("cart_id")
                        .as("cart_items");
                }, function (join) { return join.onTrue(); })
                    .select("cart_items.cart_items")
                    .executeTakeFirst()];
            case 1:
                cart = _a.sent();
                return [2 /*return*/, res.status(200).json(cart)];
        }
    });
}); };
exports.getCartById = getCartById;
var getCartItems = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var prod;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .selectFrom("cart_items")
                    .selectAll()
                    .where(function (arg) {
                    var _a;
                    return arg.and({
                        cart_id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                    });
                })
                    .innerJoin("products", "products.id", "cart_items.product_id")
                    .execute()
                    .catch(function (err) {
                    if (err) {
                        throw new customErrors_ts_1.NotFoundError("Not found");
                    }
                })];
            case 1:
                prod = _a.sent();
                return [2 /*return*/, res.json({ message: "Your cart items", body: prod })];
        }
    });
}); };
exports.getCartItems = getCartItems;
var addItemToCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cartItem;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .insertInto("cart_items")
                    .values(req.body)
                    .returningAll()
                    .executeTakeFirstOrThrow()];
            case 1:
                cartItem = _a.sent();
                console.log(cartItem);
                return [2 /*return*/, res.json({ message: "Item added to cart", body: cartItem })];
        }
    });
}); };
exports.addItemToCart = addItemToCart;
var updateCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cartItem;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .updateTable("cart_items")
                    .where("cart_items.cart_id", "=", req.user.cart_id)
                    .set({
                    quantity: req.body.quantity,
                })
                    .where("product_id", "=", req.body.product_id)
                    .returningAll()
                    .executeTakeFirstOrThrow()];
            case 1:
                cartItem = _a.sent();
                return [2 /*return*/, res.json(cartItem)];
        }
    });
}); };
exports.updateCart = updateCart;
var deleteCartItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .deleteFrom("cart_items")
                    .where("product_id", "=", req.params.id)
                    .executeTakeFirstOrThrow()];
            case 1:
                _a.sent();
                return [2 /*return*/, res.json({ message: "Item Deleted" })];
        }
    });
}); };
exports.deleteCartItem = deleteCartItem;
var clearCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user || !req.user.cart_id) {
                    throw new customErrors_ts_1.BadRequestError("");
                }
                return [4 /*yield*/, database_ts_1.db
                        .deleteFrom("cart_items")
                        .where("cart_id", "=", req.user.cart_id)
                        .execute()];
            case 1:
                _a.sent();
                return [2 /*return*/, res.json({ message: "Cart Cleared." })];
        }
    });
}); };
exports.clearCart = clearCart;
