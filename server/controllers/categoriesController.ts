import { db } from "../database.ts";
import type { Request, Response } from "express";
import { sqlJSON } from "../utils/utils.ts";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import getPages from "../utils/getPages.ts";

export const getAllCategories = async (req: Request, res: Response) => {
  const catgs = db
    .selectFrom("categories")
    .$if(!!req.query.q, (eb) => eb.where("name", "ilike", `${req.query.q}%`))

    .selectAll();

  const results = await getPages(
    catgs,
    (Number(req.query.page) - 1) * 10 || 0,
    Number(req.query.limit) || 10,
  );

  return res.status(200).json(results);
};

export const getOneCategory = async (req: Request, res: Response) => {
  const catg = await db
    .selectFrom("categories")
    .selectAll()
    .where("id", "=", req.params.id)
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom("product_category")
          .where("product_category.category_id", "=", req.params.id)
          .leftJoin("products", "products.id", "product_category.product_id")
          .selectAll(),
      ).as("products"),
    )
    .executeTakeFirst();
  return res.status(200).json(catg);
};

export const getOneCategoryProducts = async (req: Request, res: Response) => {
  const catg = db
    .selectFrom("product_category")
    .where("product_category.category_id", "=", req.params.id)
    .leftJoinLateral(
      (eb) =>
        eb
          .selectFrom("products")
          .whereRef("products.id", "=", "product_category.product_id")
          .groupBy("products.id")

          .selectAll()
          .as("products"),
      (join) => join.onTrue(),
    )
    .selectAll();

  const catgName = db
    .selectFrom("categories")
    .where("categories.id", "=", req.params.id)
    .select("categories.name");

  const [results, total, cName] = await Promise.all([
    catg
      .offset((Number(req.query.page) - 1) * 12 || 0)
      .limit(Number(req.query.limit) || 12)

      .execute(),
    catg
      .clearSelect()
      .select((eb) => [eb.fn.countAll<number>().as("count")])
      .executeTakeFirstOrThrow(),
    catgName.executeTakeFirstOrThrow(),
  ]);

  return res.status(200).json({
    results,
    total: total.count,
    pages: Math.ceil(total.count / 12),
    name: cName.name,
  });
};

export const createCategory = async (req: Request, res: Response) => {
  const catg = await db
    .insertInto("categories")
    .values(req.body)
    .returningAll()
    .executeTakeFirstOrThrow();
  return res.json({ message: "Congrats", body: catg });
};

export const updateCategory = async (req: Request, res: Response) => {
  const updatedCatg = await db
    .updateTable("categories")
    .where("id", "=", req.params.id)
    .set({
      ...req.body,
      images:
        req.body.images.length > 0 ? sqlJSON(req.body.images) : sqlJSON([]),
    })
    .returningAll()
    .executeTakeFirst();

  return res.status(200).json(updatedCatg);
};

export const updateCategoryImages = async (req: Request, res: Response) => {
  await db
    .updateTable("categories")
    .where("id", "=", req.params.id)
    .set({ images: sqlJSON(req.body) })
    .executeTakeFirstOrThrow();

  return res.status(200).json({ message: "Images updated." });
};

export const deleteCategory = async (req: Request, res: Response) => {
  await db
    .deleteFrom("categories")
    .where("id", "=", req.params.id)

    .executeTakeFirst();

  return res.status(200).json({ message: "Category deleted" });
};

export const getOneCatgAllProducts = async (req: Request, res: Response) => {
  const products = await db
    .selectFrom("product_category")
    .selectAll()
    .where("product_category.category_id", "=", req.params.id)
    .innerJoin("products", "products.id", "product_category.product_id")
    .execute();
  return res.json({ message: "Congrats", body: products });
};

export const addCategoryToProduct = async (req: Request, res: Response) => {
  const thing = await db
    .insertInto("product_category")
    .values({
      category_id: req.params.id,
      product_id: req.body.product_id,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
  console.log(thing);
  return res.json({ message: "Product added to Category", body: thing });
};

export const removeCategoryFromProduct = async (
  req: Request,
  res: Response,
) => {
  await db
    .deleteFrom("product_category")
    .where("product_category.category_id", "=", req.params.id)
    .where("product_category.product_id", "=", req.body.product_id)
    .executeTakeFirstOrThrow();

  return res.json({ message: "Product removed from category." });
};
