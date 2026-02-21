import type { Response, Request } from "express";
import { db } from "../database.ts";
import { BadRequestError, UnauthorisedError } from "../errors/customErrors.ts";
import { sql } from "kysely";
import { sqlJSON } from "../utils/utils.ts";

export const getFrontpage = async (req: Request, res: Response) => {
  const frontpage = await db.selectFrom("frontpage").selectAll().execute();

  return res.status(200).json(frontpage);
};

export const getCurrentFrontpage = async (req: Request, res: Response) => {
  const page = await db
    .selectFrom("frontpage")
    .where("current", "=", true)
    .selectAll()
    .executeTakeFirst()
    .catch(() => new BadRequestError("Couldn't find page."));

  return res.status(200).json(page);
};

export const getOneFrontpage = async (req: Request, res: Response) => {
  const page = await db
    .selectFrom("frontpage")
    .where("id", "=", req.params.id)
    .selectAll()
    .executeTakeFirst()
    .catch(() => new BadRequestError("Couldn't find page."));

  return res.status(200).json(page);
};

export const createFrontpage = async (req: Request, res: Response) => {
  if (req.body.current === true) {
    await db
      .updateTable("frontpage")
      .where("current", "=", true)
      .set({ current: null })
      .execute();
  }
  const page = await db
    .insertInto("frontpage")
    .values({
      name: req.body.name,
      current: req.body.current,
      products: sqlJSON(req.body.products),
      categories: sqlJSON(req.body.categories),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return res.status(201).json(page);
};

export const updatePage = async (req: Request, res: Response) => {
  if (req.body.current === true) {
    await db
      .updateTable("frontpage")
      .where("current", "=", true)
      .set({ current: null })
      .execute();
  }
  console.log(req.body);
  const updatedPage = await db
    .updateTable("frontpage")
    .where("id", "=", req.params.id)
    .set({
      name: req.body.name,
      products: sqlJSON(req.body.products),
      categories: sqlJSON(req.body.categories),
      current: req.body.current,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .catch(() => new BadRequestError("Couldn't update Page."));
  return res.status(200).json(updatedPage);
};

export const deletePage = async (req: Request, res: Response) => {
  await db
    .deleteFrom("frontpage")
    .where("id", "=", req.params.id)
    .executeTakeFirst()
    .catch(() => new BadRequestError("Couldn't delete page."));

  return res.json({ message: "Page deleted." });
};
