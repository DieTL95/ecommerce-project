import express from "express";
import morgan from "morgan";
import authRouter from "./routes/authRouter.ts";
import addressRouter from "./routes/addressRouter.ts";
import usersRouter from "./routes/usersRouter.ts";
import productsRouter from "./routes/productsRouter.ts";
import categoriesRouter from "./routes/categoriesRouter.ts";
import checkoutRouter from "./routes/checkoutRouter.ts";
import cartRouter from "./routes/cartRouter.ts";
import ordersRouter from "./routes/ordersRouter.ts";
import frontpageRouter from "./routes/frontpageRouter.ts";
import errorMiddleware from "./middleware/errorMiddleware.ts";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";
import dotenv from "dotenv";
import passport from "passport";
import { strategy } from "./utils/passport.ts";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import signedUploadRouter from "./routes/signedUploadRouter.ts";
const pgStore = pgSession(session);
dotenv.config();

const app = express();
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_PUBLIC,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const corsOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.PUBLIC_DOMAIN
    : process.env.DEV_DOMAIN;
const isProduction = process.env.NODE_ENV === "production";
app.use(
  cors({
    origin: corsOrigin,

    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,

    cookie: {
      sameSite: isProduction ? "none" : "lax",
      httpOnly: true,
      secure: isProduction ? true : false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      domain: isProduction
        ? (process.env.PUBLIC_DOMAIN as string)
        : process.env.DEV_DOMAIN,
    },
    store: new pgStore({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
      }),

      tableName: "session",
    }),
  }),
);

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/frontpage", frontpageRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/users", usersRouter);
app.use("/api/address", addressRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/signed-upload", signedUploadRouter);

app.use(errorMiddleware);

app.listen(5100, () => {
  console.log("listening on port 5100");
});
