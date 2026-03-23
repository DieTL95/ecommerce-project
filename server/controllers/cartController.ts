import { db } from "../database.ts";
import { jsonBuildObject } from "kysely/helpers/postgres";
import type { Request, Response } from "express";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorisedError,
} from "../errors/customErrors.ts";

export const getAllCarts = async (req: Request, res: Response) => {
  const cart = await db.selectFrom("cart").selectAll().execute();
  if (!cart) {
    return res.status(400).json({ message: "Request error" });
  }
  return res.status(200).json(cart);
};

export const createCart = async (req: Request, res: Response) => {
  const body = {
    userId: req.user?.id,
    session_id: req.sessionID,
  };
  const cart = await db
    .insertInto("cart")
    .values(body)
    .returningAll()
    .executeTakeFirstOrThrow(
      (er) => new Error("Cart creation failed.", { cause: er }),
    );

  if (cart) {
    await db
      .updateTable("session")
      .where("sid", "=", req.sessionID)
      .set({ sess: { cart_id: cart.id, cookie: req.session.cookie } })
      .executeTakeFirstOrThrow(
        (er) => new Error("Adding cart_id to session failed.", { cause: er }),
      );
  }

  return res.status(201).json({ message: "Cart created.", body: cart });
};

export const getCurrentCart = async (req: Request, res: Response) => {
  const cart = await db
    .selectFrom("cart")
    .selectAll("cart")
    .where("cart.id", "=", req.user ? req.user.cart_id : req.session.cart_id!)
    .leftJoinLateral(
      (eb) =>
        eb
          .selectFrom("cart_items")
          .whereRef("cart_items.cart_id", "=", "cart.id")
          .leftJoin("products", (join) =>
            join.onRef("products.id", "=", "cart_items.product_id"),
          )
          .select(({ fn, ref, table }) =>
            fn
              .jsonAgg(
                jsonBuildObject({
                  id: ref("cart_items.id"),
                  quantity: ref("cart_items.quantity"),
                  price: ref("cart_items.price"),
                  total_price: ref("cart_items.total_price"),
                  product: table("products"),
                }),
              )
              .as("cart_items"),
          )
          .groupBy("cart_id")
          .as("cart_items"),
      (join) => join.onTrue(),
    )
    .select("cart_items.cart_items")

    .executeTakeFirst();

  return res.status(200).json(cart);
};

export const getCartById = async (req: Request, res: Response) => {
  const cart = await db
    .selectFrom("cart")
    .where("cart.id", "=", req.params.id)
    .selectAll("cart")
    .leftJoinLateral(
      (eb) =>
        eb
          .selectFrom("cart_items")
          .whereRef("cart_items.cart_id", "=", "cart.id")
          .leftJoin("products", (join) =>
            join.onRef("products.id", "=", "cart_items.product_id"),
          )
          .select(({ fn, ref, table }) =>
            fn
              .jsonAgg(
                jsonBuildObject({
                  id: ref("cart_items.id"),
                  quantity: ref("cart_items.quantity"),
                  price: ref("cart_items.price"),
                  total_price: ref("cart_items.total_price"),
                  product: table("products"),
                }),
              )
              .as("cart_items"),
          )
          .groupBy("cart_id")
          .as("cart_items"),
      (join) => join.onTrue(),
    )
    .select("cart_items.cart_items")

    .executeTakeFirst();

  return res.status(200).json(cart);
};

export const getCartItems = async (req: Request, res: Response) => {
  const prod = await db
    .selectFrom("cart_items")
    .selectAll()
    .where((arg) =>
      arg.and({
        cart_id: req.user?.id,
      }),
    )
    .innerJoin("products", "products.id", "cart_items.product_id")
    .execute()
    .catch((err) => {
      if (err) {
        throw new NotFoundError("Not found");
      }
    });
  return res.json({ message: "Your cart items", body: prod });
};

export const addItemToCart = async (req: Request, res: Response) => {
  const cartItem = await db
    .insertInto("cart_items")
    .values(req.body)
    .returningAll()
    .executeTakeFirstOrThrow();
  console.log(cartItem);
  return res.json({ message: "Item added to cart", body: cartItem });
};

export const updateCart = async (req: Request, res: Response) => {
  const cartItem = await db
    .updateTable("cart_items")
    .where("cart_items.cart_id", "=", req.user!.cart_id)
    .set({
      quantity: req.body.quantity,
    })
    .where("product_id", "=", req.body.product_id)
    .returningAll()
    .executeTakeFirstOrThrow();
  return res.json(cartItem);
};

export const deleteCartItem = async (req: Request, res: Response) => {
  await db
    .deleteFrom("cart_items")
    .where("product_id", "=", req.params.id)
    .executeTakeFirstOrThrow();
  return res.json({ message: "Item Deleted" });
};

export const clearCart = async (req: Request, res: Response) => {
  await db
    .deleteFrom("cart_items")
    .where("cart_id", "=", req.params.id)
    .execute();
  return res.json({ message: "Cart Cleared." });
};
