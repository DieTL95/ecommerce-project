import z from "zod";

export const addressSchema = z.object({
  body: z.object({
    label: z
    .string("Enter a valid")
    .min(2, "To change it later")
    .max(500, "Too much pal"),
    full_name: z
    .string("Enter a valid")
    .min(2, "Enter a valid full name.")
    .max(50, "Too much"),
    email: z.email("Enter a valid email to receive tracking number"),
    address_one: z
    .string("Enter a valid")
    .min(2, "Enter a valid address.")
    .max(50, "Too much"),
    address_two: z
    .string("Enter a valid")
    .min(2, "Enter a valid street name.")
    .max(50, "Too much"),
    country: z
    .string("Enter a valid")
    .min(2, "Enter a valid country.")
    .max(50, "Too much"),
    province: z
    .string("Enter a valid")
    .min(2, "Enter a valid province.")
    .max(50, "Too much"),
    city: z
    .string("Enter a valid")
    .min(2, "Enter a valid city.")
    .max(50, "Too much"),
    
    phonenumber: z.number().positive("has to be a positive number"),
    zipcode: z.string("Enter a valid").min(3, "Enter a valid zipcode."),
  })
});
