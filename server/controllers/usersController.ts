import type { Request, Response } from "express";
import { db } from "../database.ts";
import { BadRequestError, UnauthorisedError } from "../errors/customErrors.ts";
import { hash } from "bcrypt";
export const getUsers = async (req: Request, res: Response) => {
  const users = await db.selectFrom("users").selectAll("users").execute();
  return res.json(users || "No users available");
};

export const createUser = async (req: Request, res: Response) => {
  const hashedPass = await hash(req.body.password, 10);
  req.body.password = hashedPass;
  const user = await db
    .insertInto("users")
    .values(req.body)
    .returningAll()
    .executeTakeFirstOrThrow()
    .catch((err) => {
      throw new BadRequestError(err.message);
    });

  if (!req.session.cart_id) {
    await db
      .insertInto("cart")
      .values({
        user_id: user.id,
      })
      .execute();
  } else {
    await db
      .updateTable("cart")
      .where("cart.id", "=", req.session.cart_id)
      .set({ user_id: user.id })
      .execute();
  }

  return res.json({ message: "Congrats", body: user });
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorisedError("");
  }
  const updatedUser = await db
    .updateTable("users")
    .where("id", "=", req.user.id)
    .set(req.body)
    .returningAll()
    .executeTakeFirstOrThrow()
    .catch(() => new BadRequestError("Couldn't update user."));
  return res.status(200).json(updatedUser);
};

export const getOneUser = async (req: Request, res: Response) => {
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", req.params.id)
    .execute()
    .catch(() => {
      throw new BadRequestError("Couldn't find user.");
    });
  if (user.length === 0) {
    return res.status(200).json({ message: "User doesn't exist." });
  }
  return res.status(200).json({ user });
};

export const deleteUser = async (req: Request, res: Response) => {
  await db
    .deleteFrom("users")
    .where("id", "=", req.params.id)
    .executeTakeFirst()
    .catch(() => new BadRequestError("Couldn't delete user."));

  return res.json({ message: "User deleted." });
};
