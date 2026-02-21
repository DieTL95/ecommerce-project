import z from "zod";

export const cartValueSchema = z.object({
  body: z.object({
    total_value: z.number().positive(),
  }),
});

export const cartItemSchema = z.object({
  body: z.object({
    quantity: z.number().nonoptional(),
    price: z.number().nonoptional(),
  }),
});
