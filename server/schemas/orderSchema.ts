import z from "zod";

export const orderSchema = z.object({
  body: z.object({
    value: z.number().positive(),
    status: z.string(),
  }),
});

export const orderItemSchema = z.object({
  body: z.object({
    quantity: z.number(),
    price: z.number(),
  }),
});
