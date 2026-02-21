import { z } from "zod";

export const registerationSchema = z.object({
  name: z.string("Pleae valid name").min(2, "Pleae valid name"),
  email: z.email("Please enter a valid email."),
  password: z
    .string("Please enter a password")
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain a number" })
    .regex(/[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/, {
      message: "Password must contain a special character",
    }),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email."),
  password: z
    .string("Please enter a password")
    .min(1, "Enter a password")
    .max(50),
});
