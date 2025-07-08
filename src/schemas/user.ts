import { z } from "zod"

export const loginUserSchema = z.object({
  email: z.string().email({ message: "Please provide valid email" }),
  password: z
    .string()
    .min(5, "Password must be between 5 to 18 characters")
    .max(18, "Password must be between 5 to 18 characters"),
})

export const registerUserSchema = z.object({
  name: z.string().min(5, "Required"),
  email: z.string().email({ message: "Please provide valid email" }),
  password: z
    .string()
    .min(5, "Password must be between 5 to 18 characters")
    .max(18, "Password must be between 5 to 18 characters"),
})
