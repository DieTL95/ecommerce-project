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
exports.deleteProduct = exports.updateProductImages = exports.updateProduct = exports.getOneProduct = exports.removeProductFromCategory = exports.addProductToCategory = exports.getProductCategories = exports.createProduct = exports.getAllProducts = void 0;
var database_ts_1 = require("../database.ts");
var utils_ts_1 = require("../utils/utils.ts");
var postgres_1 = require("kysely/helpers/postgres");
var getPages_ts_1 = require("../utils/getPages.ts");
var getAllProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var prods, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                prods = database_ts_1.db
                    .selectFrom("products")
                    .$if(!!req.query.q, function (eb) { return eb.where("name", "ilike", "".concat(req.query.q, "%")); })
                    .selectAll();
                return [4 /*yield*/, (0, getPages_ts_1.default)(prods, (Number(req.query.page) - 1) * 12 || 0, Number(req.query.limit) || 12)];
            case 1:
                results = _a.sent();
                return [2 /*return*/, res.status(200).json(results)];
        }
    });
}); };
exports.getAllProducts = getAllProducts;
var createProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var prod;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                    var insertedProd;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, trx
                                    .insertInto("products")
                                    .values({
                                    name: req.body.name,
                                    description: req.body.description,
                                    price: req.body.price,
                                    images: req.body.images.length > 0 ? (0, utils_ts_1.sqlJSON)(req.body.images) : (0, utils_ts_1.sqlJSON)([]),
                                })
                                    .returningAll()
                                    .executeTakeFirstOrThrow()];
                            case 1:
                                insertedProd = _a.sent();
                                if (req.body.categories) {
                                    req.body.categories.forEach(function (catg) { return __awaiter(void 0, void 0, void 0, function () {
                                        var newCategory;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!!catg.id) return [3 /*break*/, 3];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("categories")
                                                            .values({ name: catg.name, description: catg.name })
                                                            .returningAll()
                                                            .executeTakeFirstOrThrow()];
                                                case 1:
                                                    newCategory = _a.sent();
                                                    return [4 /*yield*/, trx
                                                            .insertInto("product_category")
                                                            .values({
                                                            product_id: insertedProd.id,
                                                            category_id: newCategory.id,
                                                        })
                                                            .execute()];
                                                case 2:
                                                    _a.sent();
                                                    return [3 /*break*/, 5];
                                                case 3: return [4 /*yield*/, trx
                                                        .insertInto("product_category")
                                                        .values({ product_id: insertedProd.id, category_id: catg.id })
                                                        .execute()];
                                                case 4:
                                                    _a.sent();
                                                    _a.label = 5;
                                                case 5: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                }
                                return [2 /*return*/, insertedProd];
                        }
                    });
                }); })];
            case 1:
                prod = _a.sent();
                return [2 /*return*/, res.status(201).json(prod)];
        }
    });
}); };
exports.createProduct = createProduct;
var getProductCategories = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .selectFrom("product_category")
                    .selectAll()
                    .where("product_category.product_id", "=", req.params.id)
                    .innerJoin("categories", "categories.id", "product_category.category_id")
                    .execute()];
            case 1:
                categories = _a.sent();
                return [2 /*return*/, res.json({ message: "Congrats", body: categories })];
        }
    });
}); };
exports.getProductCategories = getProductCategories;
var addProductToCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .insertInto("product_category")
                    .values({
                    product_id: req.params.id,
                    category_id: req.body.category_id,
                })
                    .returningAll()
                    .executeTakeFirstOrThrow()];
            case 1:
                product = _a.sent();
                console.log(product);
                return [2 /*return*/, res.json({ message: "Product added to Category", body: product })];
        }
    });
}); };
exports.addProductToCategory = addProductToCategory;
var removeProductFromCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .deleteFrom("product_category")
                    .where("product_category.product_id", "=", req.params.id)
                    .where("product_category.category_id", "=", req.body.category_id)
                    .executeTakeFirstOrThrow()];
            case 1:
                _a.sent();
                return [2 /*return*/, res.json({ message: "Product removed from category." })];
        }
    });
}); };
exports.removeProductFromCategory = removeProductFromCategory;
var getOneProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var prod;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .selectFrom("products")
                    .where("products.id", "=", req.params.id)
                    .selectAll()
                    .select(function (eb) {
                    return (0, postgres_1.jsonArrayFrom)(eb
                        .selectFrom("product_category")
                        .where("product_category.product_id", "=", req.params.id)
                        .fullJoin("categories", "categories.id", "product_category.category_id")
                        .selectAll()).as("categories");
                })
                    .executeTakeFirst()];
            case 1:
                prod = _a.sent();
                return [2 /*return*/, res.json(prod)];
        }
    });
}); };
exports.getOneProduct = getOneProduct;
var updateProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allProdCatgs, removedCatgs, updatedProduct;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .selectFrom("product_category")
                    .where("product_category.product_id", "=", req.params.id)
                    .selectAll()
                    .execute()];
            case 1:
                allProdCatgs = _a.sent();
                if (req.body.categories) {
                    removedCatgs = allProdCatgs.filter(function (x) {
                        return req.body.categories.some(function (categore) { return categore.id !== x.category_id; });
                    });
                    removedCatgs.forEach(function (x) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, database_ts_1.db
                                        .deleteFrom("product_category")
                                        .where("product_category.category_id", "=", x.category_id)
                                        .execute()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); });
                    req.body.categories.forEach(function (catg) { return __awaiter(void 0, void 0, void 0, function () {
                        var newCategory;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!catg.id) return [3 /*break*/, 3];
                                    return [4 /*yield*/, database_ts_1.db
                                            .insertInto("categories")
                                            .values({ name: catg.name })
                                            .returningAll()
                                            .executeTakeFirstOrThrow()];
                                case 1:
                                    newCategory = _a.sent();
                                    return [4 /*yield*/, database_ts_1.db
                                            .insertInto("product_category")
                                            .values({ product_id: req.params.id, category_id: newCategory.id })
                                            .execute()];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, database_ts_1.db
                                        .insertInto("product_category")
                                        .values({ product_id: req.params.id, category_id: catg.id })
                                        .onConflict(function (eb) { return eb.doNothing(); })
                                        .execute()];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                }
                console.log(req.body);
                return [4 /*yield*/, database_ts_1.db
                        .updateTable("products")
                        .where("id", "=", req.params.id)
                        .set({
                        name: req.body.name,
                        description: req.body.description,
                        price: req.body.price,
                        images: req.body.images.length > 0 ? (0, utils_ts_1.sqlJSON)(req.body.images) : (0, utils_ts_1.sqlJSON)([]),
                    })
                        .returningAll()
                        .executeTakeFirst()];
            case 2:
                updatedProduct = _a.sent();
                return [2 /*return*/, res.status(200).json(updatedProduct)];
        }
    });
}); };
exports.updateProduct = updateProduct;
var updateProductImages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedProduct;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .updateTable("products")
                    .where("id", "=", req.params.id)
                    .set({ images: (0, utils_ts_1.sqlJSON)(req.body) })
                    .executeTakeFirstOrThrow()];
            case 1:
                updatedProduct = _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Images updated." })];
        }
    });
}); };
exports.updateProductImages = updateProductImages;
var deleteProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .deleteFrom("products")
                    .where("id", "=", req.params.id)
                    .executeTakeFirst()];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Product Deleted." })];
        }
    });
}); };
exports.deleteProduct = deleteProduct;
