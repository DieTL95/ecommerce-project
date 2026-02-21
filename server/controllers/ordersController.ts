import { db } from "../database.ts";
import type { OrderItems } from "../db.d.ts";
import type { Request, Response } from "express";
import { BadRequestError, UnauthorisedError } from "../errors/customErrors.ts";
import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";

export const getAllOrders = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorisedError("");
  }

  //   const { rows } = await sql`SELECT orders.*,
  //        order_item.order_items
  // FROM orders
  // LEFT JOIN LATERAL (
  //   SELECT order_id, json_agg(
  //     json_build_object(
  //       'id', order_items.id,
  //       'quantity', order_items.quantity,
  //       'price', order_items.price,
  //       'product', products
  //     )
  //   ) AS order_items
  //   FROM order_items
  //   LEFT JOIN products ON order_items.product_id = products.id
  //   WHERE orders.user_id = ${req.user.id}
  //   GROUP BY order_id
  // ) AS order_item ON orders.id = order_item.order_id;`.execute(db);

  // const orders = await db
  //   .selectFrom("orders")
  //   .where("orders.user_id", "=", req.user.id)
  //   .selectAll("orders")
  //   .innerJoin("order_items", "order_items.order_id", "orders.id")
  //   .innerJoin("products", "products.id", "order_items.product_id")

  //   //     .as("order_items")
  //   // .select((eb) => [
  //   //   eb
  //   //     .selectFrom("order_items")
  //   //     .whereRef("order_items.order_id", "=", "orders.id")
  //   // .select((eb) => [eb.fn.jsonAgg("order_items").as("order_items")])

  //   //     .as("order_items"),
  //   // ])

  //   .groupBy("orders.id")
  //   .execute();

  const orders = await db
    .selectFrom("orders")
    .where("orders.user_id", "=", req.user.id)
    .selectAll("orders")
    .leftJoinLateral(
      (eb) =>
        eb
          .selectFrom("order_items")
          .whereRef("order_items.order_id", "=", "orders.id")
          .leftJoin("products", (join) =>
            join.onRef("products.id", "=", "order_items.product_id"),
          )
          .select(({ fn, ref, table }) =>
            fn
              .jsonAgg(
                jsonBuildObject({
                  id: ref("order_items.id"),
                  quantity: ref("order_items.quantity"),
                  price: ref("order_items.price"),
                  product: table("products"),
                }),
              )
              .as("order_items"),
          )
          .groupBy("order_id")
          .as("order_items"),
      (join) => join.onTrue(),
    )
    .select("order_items.order_items")
    .execute();

  return res.status(200).json(orders);
};

export const createOrder = async (req: Request, res: Response) => {
  const transaction = await db
    .transaction()
    .execute(async (trx) => {
      const userAddress = req.body.user_id
        ? await db
            .selectFrom("addresses")
            .where("addresses.user_id", "=", req.body.user_id)
            .select("addresses.id")
            .executeTakeFirst()
        : undefined;
      const order = await trx
        .insertInto("orders")
        .values({
          value: req.body.value,
          user_id: req.body.user_id,
          address_id: userAddress?.id || req.body.address_id,
        })
        .returning("id")
        .executeTakeFirstOrThrow();
      // Inserting order.id into the request body array to allow for their iteration with the rest of the items
      const order_items: OrderItems[] = req.body.order_items;
      order_items.forEach((item) => (item.order_id = order.id));
      await trx
        .insertInto("order_items")
        .values([...order_items])
        .returningAll()
        .execute();
      return order.id;
    })
    .catch((err) => {
      console.log(err);
      throw new BadRequestError("Couldn't create order.");
    });
  console.log(transaction);
  return res.json({ message: "Order placed.", body: transaction });
};

export const getOneOrder = async (req: Request, res: Response) => {
  const order = await db
    .selectFrom("orders")
    .where("orders.id", "=", req.params.id)
    .selectAll("orders")
    .leftJoinLateral(
      (eb) =>
        eb
          .selectFrom("order_items")
          .whereRef("order_items.order_id", "=", "orders.id")
          .leftJoin("products", (join) =>
            join.onRef("products.id", "=", "order_items.product_id"),
          )
          .select(({ fn, ref, table }) =>
            fn
              .jsonAgg(
                jsonBuildObject({
                  id: ref("order_items.id"),
                  quantity: ref("order_items.quantity"),
                  price: ref("order_items.price"),
                  product: table("products"),
                }),
              )
              .as("order_items"),
          )
          .groupBy("order_id")
          .as("order_items"),
      (join) => join.onTrue(),
    )
    .select("order_items.order_items")
    .executeTakeFirst();

  return res.status(200).json(order);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const order = await db
    .updateTable("orders")
    .where("orders.id", "=", req.params.id)
    .set({ status: req.body.status })
    .returningAll()
    .executeTakeFirst();

  return res.status(200).json(order);
};
