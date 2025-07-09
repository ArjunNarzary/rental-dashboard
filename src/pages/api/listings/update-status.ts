import { ListingStatus } from "@/generated/prisma"
import prisma from "@/lib/prisma"
import { updateStatusSchema } from "@/schemas/listing"
import { NextApiRequest, NextApiResponse } from "next"

const statusMapping = {
  approve: ListingStatus.approved,
  reject: ListingStatus.rejected,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
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
