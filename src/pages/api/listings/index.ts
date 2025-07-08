import prisma from "@/lib/prisma"
import { registerUserSchema } from "@/schemas/user"
import { NextApiRequest, NextApiResponse } from "next"
import { hashPassword } from "@/lib/password"
import { getServerSession } from "next-auth"
import authOptions from "../auth/[...nextauth]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({ message: "You must be logged in." })
    return
  }
  try {
  } catch {
    res.status(500).json({
      error: true,
      message: "Something went wrong. Please try again",
    })
  }
}
