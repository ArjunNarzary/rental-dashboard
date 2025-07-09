import prisma from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
// import { getServerSession } from "next-auth"
// import authOptions from "../auth/[...nextauth]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   const session = await getServerSession(req, res, authOptions)
  //   console.log("sesssionssss", session)
  //   if (!session) {
  //     res.status(401).json({ message: "You must be logged in." })
  //     return
  //   }
  try {
    const listings = await prisma.listing.findMany()

    return res.status(200).json({
      listings,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      error: true,
      message: "Something went wrong. Please try again",
    })
  }
}
