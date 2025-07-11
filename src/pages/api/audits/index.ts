import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      return res.status(401).json({
        error: true,
        message: "Unaithorized",
      })
    }
    const audits = await prisma.audit.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        list: {
          select: { id: true, name: true },
        },
      },
    })
    return res.status(200).json({
      error: false,
      audits: audits,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      error: true,
      message: "Something went wrong. Please try again",
    })
  }
}
