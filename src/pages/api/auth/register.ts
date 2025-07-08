import prisma from "@/lib/prisma"
import { registerUserSchema } from "@/schemas/user"
import { NextApiRequest, NextApiResponse } from "next"
import { hashPassword } from "@/lib/password"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { success, data } = registerUserSchema.safeParse(req.body)
    if (!success) {
      res.status(400).json({
        error: true,
        message: "Invalid inputs",
      })
    }

    // Check if email already registered
    const userExist = await prisma.user.findUnique({
      where: {
        email: data?.email,
      },
    })

    if (userExist) {
      res.status(400).json({
        error: true,
        message: "User already registered. Try logging in.",
      })
    }

    const hashedPassword = await hashPassword(data?.password as string)

    await prisma.user.create({
      data: {
        name: data?.name as string,
        email: data?.email as string,
        password: hashedPassword,
      },
    })

    res.status(201).json({
      error: false,
      message: "User registered successfully. Try logging in now.",
    })
  } catch {
    res.status(500).json({
      error: true,
      message: "Something went wrong. Please try again",
    })
  }
}
