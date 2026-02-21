import z from "zod";

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Enter a valid category name.").max(50, "Too much"),
    description: z
      .string()
      .min(5, "To change it later")
      .max(500, "Too much pal")
      .optional(),
    images: z.object(z.array(z.string()).optional()).optional(),

    details: z
      .object({
        material: z.string().optional(),
        origin: z.string().optional(),
      })
      .optional(),
  }),
});
