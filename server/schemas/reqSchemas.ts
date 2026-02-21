import z from "zod";

export const paramSchema = z.object({
  params: z.object({
    id: z.uuidv4("Invalid parameter ID."),
  }),
});
