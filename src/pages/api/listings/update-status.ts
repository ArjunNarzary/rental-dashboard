import { ListingStatus } from "@/generated/prisma"
import prisma from "@/lib/prisma"
import { updateStatusSchema } from "@/schemas/listing"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

const statusMapping = {
  approve: ListingStatus.approved,
  reject: ListingStatus.rejected,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      })
    }

    const { success, data } = updateStatusSchema.safeParse(req.body)

    if (!success) {
      return res.status(400).json({
        error: true,
        message: "Invalid data provided.",
      })
    }

    const listings = await prisma.listing.findUnique({
      where: {
        id: data?.id,
      },
    })

    if (!listings) {
      return res.status(404).json({
        error: true,
        message: "Listing not found.",
      })
    }

    if (listings.status === statusMapping[data.status]) {
      return res.status(200).json({
        error: false,
        message: "List updated successfully.",
      })
    }

    const updatedListing = await prisma.listing.update({
      where: {
        id: data?.id,
      },
      data: {
        status: statusMapping[data.status],
      },
    })

    // Added at audit table
    await prisma.audit.create({
      data: {
        adminId: session.user.id,
        listId: updatedListing.id,
        action: statusMapping[data.status],
      },
    })

    return res.status(200).json({
      updatedListing,
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      error: true,
      message: "Something went wrong. Please try again",
    })
  }
}
