import z from "zod"

export const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["approve", "reject"]),
})
export const updateListSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, "Name must be between 2 to 50 characters")
    .max(50, "Name must be between 2 to 50 characters"),
  price: z
    .number()
    .min(10, "Price must be between Rs. 10 to Rs. 500000.")
    .max(500000, "Price must be between Rs. 10 to Rs. 500000."),
  status: z.enum(["approved", "rejected", "pending"]),
})
