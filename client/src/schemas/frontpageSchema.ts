import z from "zod";
import { categorySchema } from "./categorySchema";
import { productSchema } from "./productSchema";

export const frontpageSchema = z.object({
  name: z.string("Cant be mepty"),
  categories: categorySchema.optional(),
  products: productSchema.optional(),
  current: z.boolean(),
});
