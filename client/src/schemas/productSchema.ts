import z from "zod";
import { categorySchema } from "./categorySchema";

export const productSchema = z.object({
  name: z.string().min(5, "Enter a valid product name.").max(50, "Too much"),
  description: z.string().min(5, "To change it later").max(500, "Too much pal"),
  images: z.array(
    z.object({
      public_id: z.string(),
      width: z.number(),
      height: z.number(),
      format: z.string(),
      created_at: z.string(),
      bytes: z.number(),
      url: z.string(),
      secure_url: z.string(),
    }),
  ),
  categories: z.array(categorySchema),
  price: z
    .number()
    .positive("has to be a positive number")
    .max(9999999, "exceeds maximum")
    .min(0),
  details: z
    .object({
      material: z.string().optional().nullish().nullable(),
      origin: z.string().optional().nullish().nullable(),
    })
    .nullish()
    .nullable()
    .optional(),
});

export const productSearchSchema = z.object({
  page: z.number().optional().catch(1),
  q: z.string().optional(),
});
