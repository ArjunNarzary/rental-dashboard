import { updateListSchema } from "@/schemas/listing"
import prisma from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized",
    })
  }

  const { success, data } = updateListSchema.safeParse(req.body)
  if (!success) {
    return res.status(400).json({
      error: true,
      message: "Invalid data provided",
    })
  }

  const { id } = req.query

  if (typeof id !== "string") {
    return res.status(400).json({
      error: true,
      message: "Invalid list",
    })
  }

  // Check if list exist
  const list = await prisma.listing.findUnique({
    where: {
      id,
    },
  })

  if (!list) {
    return res.status(404).json({
      error: true,
      message: "List not found",
    })
  }

  // Update list
  const updatedList = await prisma.listing.update({
    where: { id },
    data: { ...data },
  })

  // Add at audit table
  await prisma.audit.create({
    data: {
      adminId: session?.user?.id,
      listId: updatedList.id,
      action: "edited",
    },
  })

  return res.status(200).json({
    error: false,
    message: "List updated successfully.",
    updatedList,
  })
}
