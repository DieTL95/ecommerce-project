import { db } from "../database.ts";
import { type Request, type Response } from "express";

import { sqlJSON } from "../utils/utils.ts";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import getPages from "../utils/getPages.ts";

export const getAllProducts = async (req: Request, res: Response) => {
  const prods = db
    .selectFrom("products")
    .$if(!!req.query.q, (eb) => eb.where("name", "ilike", `${req.query.q}%`))

    .selectAll();

  const results = await getPages(
    prods,
    (Number(req.query.page) - 1) * 10 || 0,
    Number(req.query.limit) || 10,
  );
  return res.status(200).json(results);
};

export const createProduct = async (req: Request, res: Response) => {
  const prod = await db
    .insertInto("products")
    .values({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  if (req.body.categories) {
    req.body.categories.forEach(async (catg: { id: string; name: string }) => {
      if (!catg.id) {
        const newCategory = await db
          .insertInto("categories")
          .values({ name: catg.name, description: catg.name })
          .returningAll()
          .executeTakeFirstOrThrow();
        await db
          .insertInto("product_category")
          .values({ product_id: prod.id, category_id: newCategory.id })
          .execute();
      } else {
        await db
          .insertInto("product_category")
          .values({ product_id: prod.id, category_id: catg.id })
          .execute();
      }
    });
  }

  return res.status(201).json(prod);
};

export const getProductCategories = async (req: Request, res: Response) => {
  const categories = await db
    .selectFrom("product_category")
    .selectAll()
    .where("product_category.product_id", "=", req.params.id)
    .innerJoin("categories", "categories.id", "product_category.category_id")
    .execute();
  return res.json({ message: "Congrats", body: categories });
};

export const addProductToCategory = async (req: Request, res: Response) => {
  const product = await db
    .insertInto("product_category")
    .values({
      product_id: req.params.id,
      category_id: req.body.category_id,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
  console.log(product);
  return res.json({ message: "Product added to Category", body: product });
};

export const removeProductFromCategory = async (
  req: Request,
  res: Response,
) => {
  await db
    .deleteFrom("product_category")
    .where("product_category.product_id", "=", req.params.id)
    .where("product_category.category_id", "=", req.body.category_id)
    .executeTakeFirstOrThrow();

  return res.json({ message: "Product removed from category." });
};

export const getOneProduct = async (req: Request, res: Response) => {
  const prod = await db
    .selectFrom("products")
    .where("products.id", "=", req.params.id)
    .selectAll()
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom("product_category")
          .where("product_category.product_id", "=", req.params.id)
          .fullJoin(
            "categories",
            "categories.id",
            "product_category.category_id",
          )
          .selectAll(),
      ).as("categories"),
    )
    .executeTakeFirst();
  return res.json(prod);
};

export const updateProduct = async (req: Request, res: Response) => {
  const allProdCatgs = await db
    .selectFrom("product_category")
    .where("product_category.product_id", "=", req.params.id)
    .selectAll()
    .execute();

  if (req.body.categories) {
    const removedCatgs = allProdCatgs.filter((x) =>
      req.body.categories.some(
        (categore: { id: string }) => categore.id !== x.category_id,
      ),
    );
    removedCatgs.forEach(
      async (x) =>
        await db
          .deleteFrom("product_category")
          .where("product_category.category_id", "=", x.category_id)
          .execute(),
    );

    req.body.categories.forEach(async (catg: { id: string; name: string }) => {
      if (!catg.id) {
        const newCategory = await db
          .insertInto("categories")
          .values({ name: catg.name })
          .returningAll()
          .executeTakeFirstOrThrow();
        await db
          .insertInto("product_category")
          .values({ product_id: req.params.id, category_id: newCategory.id })
          .execute();
      } else {
        await db
          .insertInto("product_category")
          .values({ product_id: req.params.id, category_id: catg.id })
          .onConflict((eb) => eb.doNothing())
          .execute();
      }
    });
  }
  console.log(req.body);

  const updatedProduct = await db
    .updateTable("products")
    .where("id", "=", req.params.id)
    .set({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      images:
        req.body.images.length > 0 ? sqlJSON(req.body.images) : sqlJSON([]),
    })
    .returningAll()
    .executeTakeFirst();

  return res.status(200).json(updatedProduct);
};

export const updateProductImages = async (req: Request, res: Response) => {
  const updatedProduct = await db
    .updateTable("products")
    .where("id", "=", req.params.id)
    .set({ images: sqlJSON(req.body) })
    .executeTakeFirstOrThrow();

  return res.status(200).json({ message: "Images updated." });
};

export const deleteProduct = async (req: Request, res: Response) => {
  await db
    .deleteFrom("products")
    .where("id", "=", req.params.id)
    .executeTakeFirst();

  return res.status(200).json({ message: "Product Deleted." });
};
