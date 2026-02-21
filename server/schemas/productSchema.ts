import z from "zod";

const mimeTypes = ["image/png", "image/jpeg", "image/jpg"];
export const productSchema = z.object({
  body: z.object({
    name: z.string().min(5, "Enter a valid product name.").max(50, "Too much"),
    description: z
      .string()
      .min(5, "To change it later")
      .max(500, "Too much pal"),
    price: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .positive("has to be a positive number")
        .max(9999999, "exceeds maximum")
        .min(0),
    ),
    categories: z.array(z.object()).optional().nullable().nullish(),
    images: z.array(z.object()).optional().nullable().nullish(),
    details: z
      .object({
        material: z.string().optional(),
        origin: z.string().optional(),
      })
      .optional(),
  }),
});
