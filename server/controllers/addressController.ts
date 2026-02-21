import type { Response, Request } from "express";
import { db } from "../database.ts";
import { BadRequestError, UnauthorisedError } from "../errors/customErrors.ts";

export const getAddresses = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorisedError("");
  }
  const addresses = await db
    .selectFrom("addresses")
    .where("user_id", "=", req.user.id)
    .selectAll()
    .execute();

  return res.status(200).json(addresses);
};

export const getOneAddress = async (req: Request, res: Response) => {
  const address = await db
    .selectFrom("addresses")
    .where("id", "=", req.params.id)
    .selectAll()
    .executeTakeFirst()
    .catch(() => new BadRequestError("Couldn't find address."));

  return res.status(200).json(address);
};

export const createAddress = async (req: Request, res: Response) => {
  const address = await db
    .insertInto("addresses")
    .values({ user_id: req.user && req.user.id, ...req.body })
    .returning("addresses.id")
    .executeTakeFirstOrThrow();

  if (req.user && !req.user.default_address_id) {
    await db
      .updateTable("users")
      .where("users.id", "=", req.user.id)
      .set({ default_address_id: address.id })
      .execute();
  }

  return res.status(201).json(address);
};

export const updateAddress = async (req: Request, res: Response) => {
  const updatedAddress = await db
    .updateTable("addresses")
    .where("id", "=", req.params.id)
    .set(req.body)
    .returningAll()
    .executeTakeFirstOrThrow()
    .catch(() => new BadRequestError("Couldn't update address."));
  return res.status(200).json(updatedAddress);
};

export const deleteAddress = async (req: Request, res: Response) => {
  await db
    .deleteFrom("addresses")
    .where("id", "=", req.params.id)
    .executeTakeFirst()
    .catch(() => new BadRequestError("Couldn't delete address."));

  return res.json({ message: "Address deleted." });
};
