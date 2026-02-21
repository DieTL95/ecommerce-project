import z from "zod";
import { categorySchema } from "./categorySchema";
import { productSchema } from "./productSchema";

export const frontpageSchema = z.object({
  name: z.string("Cant be mepty"),
  productSchema,
  categorySchema,
  current: z.boolean(),
});
