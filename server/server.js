"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var morgan_1 = require("morgan");
var authRouter_ts_1 = require("./routes/authRouter.ts");
var addressRouter_ts_1 = require("./routes/addressRouter.ts");
var usersRouter_ts_1 = require("./routes/usersRouter.ts");
var productsRouter_ts_1 = require("./routes/productsRouter.ts");
var categoriesRouter_ts_1 = require("./routes/categoriesRouter.ts");
var checkoutRouter_ts_1 = require("./routes/checkoutRouter.ts");
var cartRouter_ts_1 = require("./routes/cartRouter.ts");
var ordersRouter_ts_1 = require("./routes/ordersRouter.ts");
var frontpageRouter_ts_1 = require("./routes/frontpageRouter.ts");
var errorMiddleware_ts_1 = require("./middleware/errorMiddleware.ts");
var express_session_1 = require("express-session");
var connect_pg_simple_1 = require("connect-pg-simple");
var serverless_1 = require("@neondatabase/serverless");
var dotenv_1 = require("dotenv");
var passport_1 = require("passport");
var passport_ts_1 = require("./utils/passport.ts");
var cors_1 = require("cors");
var cloudinary_1 = require("cloudinary");
var signedUploadRouter_ts_1 = require("./routes/signedUploadRouter.ts");
var pgStore = (0, connect_pg_simple_1.default)(express_session_1.default);
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.urlencoded({ extended: true }));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_PUBLIC,
    api_secret: process.env.CLOUDINARY_SECRET,
});
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: "lax",
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    },
    store: new pgStore({
        pool: new serverless_1.Pool({
            connectionString: process.env.DATABASE_URL,
        }),
        tableName: "session",
    }),
}));
passport_1.default.use(passport_ts_1.strategy);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/api/auth", authRouter_ts_1.default);
app.use("/api/frontpage", frontpageRouter_ts_1.default);
app.use("/api/checkout", checkoutRouter_ts_1.default);
app.use("/api/users", usersRouter_ts_1.default);
app.use("/api/address", addressRouter_ts_1.default);
app.use("/api/products", productsRouter_ts_1.default);
app.use("/api/categories", categoriesRouter_ts_1.default);
app.use("/api/cart", cartRouter_ts_1.default);
app.use("/api/orders", ordersRouter_ts_1.default);
app.use("/api/signed-upload", signedUploadRouter_ts_1.default);
app.use(errorMiddleware_ts_1.default);
// app.listen(5100, () => {
//   console.log("listening on port 5100");
// });
exports.default = app;
