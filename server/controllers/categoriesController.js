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
exports.removeCategoryFromProduct = exports.addCategoryToProduct = exports.getOneCatgAllProducts = exports.deleteCategory = exports.updateCategoryImages = exports.updateCategory = exports.createCategory = exports.getOneCategoryProducts = exports.getOneCategory = exports.getAllCategories = void 0;
var database_ts_1 = require("../database.ts");
var utils_ts_1 = require("../utils/utils.ts");
var postgres_1 = require("kysely/helpers/postgres");
var getPages_ts_1 = require("../utils/getPages.ts");
var getAllCategories = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var catgs, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                catgs = database_ts_1.db
                    .selectFrom("categories")
                    .$if(!!req.query.q, function (eb) { return eb.where("name", "ilike", "".concat(req.query.q, "%")); })
                    .selectAll();
                return [4 /*yield*/, (0, getPages_ts_1.default)(catgs, (Number(req.query.page) - 1) * 10 || 0, Number(req.query.limit) || 10)];
            case 1:
                results = _a.sent();
                return [2 /*return*/, res.status(200).json(results)];
        }
    });
}); };
exports.getAllCategories = getAllCategories;
var getOneCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var catg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .selectFrom("categories")
                    .selectAll()
                    .where("id", "=", req.params.id)
                    .select(function (eb) {
                    return (0, postgres_1.jsonArrayFrom)(eb
                        .selectFrom("product_category")
                        .where("product_category.category_id", "=", req.params.id)
                        .leftJoin("products", "products.id", "product_category.product_id")
                        .selectAll()).as("products");
                })
                    .executeTakeFirst()];
            case 1:
                catg = _a.sent();
                return [2 /*return*/, res.status(200).json(catg)];
        }
    });
}); };
exports.getOneCategory = getOneCategory;
var getOneCategoryProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var catg, _a, results, total;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                catg = database_ts_1.db
                    .selectFrom("product_category")
                    .where("product_category.category_id", "=", req.params.id)
                    .leftJoinLateral(function (eb) {
                    return eb
                        .selectFrom("products")
                        .whereRef("products.id", "=", "product_category.product_id")
                        .groupBy("products.id")
                        .selectAll()
                        .as("products");
                }, function (join) { return join.onTrue(); })
                    .selectAll();
                return [4 /*yield*/, Promise.all([
                        catg
                            .offset((Number(req.query.page) - 1) * 12 || 0)
                            .limit(Number(req.query.limit) || 12)
                            .execute(),
                        catg
                            .clearSelect()
                            .select(function (eb) { return [eb.fn.countAll().as("count")]; })
                            .executeTakeFirstOrThrow(),
                    ])];
            case 1:
                _a = _b.sent(), results = _a[0], total = _a[1];
                return [2 /*return*/, res.status(200).json({
                        results: results,
                        total: total.count,
                        pages: Math.ceil(total.count / 12),
                    })];
        }
    });
}); };
exports.getOneCategoryProducts = getOneCategoryProducts;
var createCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var catg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .insertInto("categories")
                    .values(req.body)
                    .returningAll()
                    .executeTakeFirstOrThrow()];
            case 1:
                catg = _a.sent();
                return [2 /*return*/, res.json({ message: "Congrats", body: catg })];
        }
    });
}); };
exports.createCategory = createCategory;
var updateCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedCatg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .updateTable("categories")
                    .where("id", "=", req.params.id)
                    .set(__assign(__assign({}, req.body), { images: req.body.images.length > 0 ? (0, utils_ts_1.sqlJSON)(req.body.images) : (0, utils_ts_1.sqlJSON)([]) }))
                    .returningAll()
                    .executeTakeFirst()];
            case 1:
                updatedCatg = _a.sent();
                return [2 /*return*/, res.status(200).json(updatedCatg)];
        }
    });
}); };
exports.updateCategory = updateCategory;
var updateCategoryImages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .updateTable("categories")
                    .where("id", "=", req.params.id)
                    .set({ images: (0, utils_ts_1.sqlJSON)(req.body) })
                    .executeTakeFirstOrThrow()];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Images updated." })];
        }
    });
}); };
exports.updateCategoryImages = updateCategoryImages;
var deleteCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .deleteFrom("categories")
                    .where("id", "=", req.params.id)
                    .executeTakeFirst()];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Category deleted" })];
        }
    });
}); };
exports.deleteCategory = deleteCategory;
var getOneCatgAllProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .selectFrom("product_category")
                    .selectAll()
                    .where("product_category.category_id", "=", req.params.id)
                    .innerJoin("products", "products.id", "product_category.product_id")
                    .execute()];
            case 1:
                products = _a.sent();
                return [2 /*return*/, res.json({ message: "Congrats", body: products })];
        }
    });
}); };
exports.getOneCatgAllProducts = getOneCatgAllProducts;
var addCategoryToProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var thing;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .insertInto("product_category")
                    .values({
                    category_id: req.params.id,
                    product_id: req.body.product_id,
                })
                    .returningAll()
                    .executeTakeFirstOrThrow()];
            case 1:
                thing = _a.sent();
                console.log(thing);
                return [2 /*return*/, res.json({ message: "Product added to Category", body: thing })];
        }
    });
}); };
exports.addCategoryToProduct = addCategoryToProduct;
var removeCategoryFromProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_ts_1.db
                    .deleteFrom("product_category")
                    .where("product_category.category_id", "=", req.params.id)
                    .where("product_category.product_id", "=", req.body.product_id)
                    .executeTakeFirstOrThrow()];
            case 1:
                _a.sent();
                return [2 /*return*/, res.json({ message: "Product removed from category." })];
        }
    });
}); };
exports.removeCategoryFromProduct = removeCategoryFromProduct;
