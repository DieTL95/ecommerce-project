import { email, z } from "zod";
import { db } from "../database.ts";

export const userSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Pleae valid name"),
    email: z.email("Please enter a valid email.").refine(async (email) => {
      const emailExists = await db
        .selectFrom("users")
        .select("email")
        .where("email", "=", email)
        .executeTakeFirst();
      return !emailExists;
    }, "Soz email exists"),
    password: z
      .string("Please enter a password")
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain a number" })
      .regex(/[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/, {
        message: "Password must contain a special character",
      }),
  }),
});

export const addressSchema = z.object({
  fullname: z.string().nonempty().nonoptional(),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email."),
  password: z.string("Please enter a password"),
});
