import z from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Enter a valid category name.").max(50, "Too much"),
  description: z
    .string()
    .min(5, "To change it later")
    .max(500, "Too much pal")
    .optional(),
  images: z
    .array(
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
    )
    .optional(),
  details: z
    .object({
      material: z.string().optional().nullish().nullable(),
      origin: z.string().optional().nullish().nullable(),
    })
    .nullish()
    .nullable()
    .optional(),
});
