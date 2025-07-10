import axios, { AxiosError, AxiosResponse } from "axios"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"
import authOptions from "../api/auth/[...nextauth]"
import { TListingResponse, TListings } from "@/types/listing"
import { DataTable } from "@/components/listing-table/data-table"
import { columns } from "@/components/listing-table/columns"
import { useState } from "react"
import z from "zod"
import { updateStatusSchema } from "@/schemas/listing"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import UpdateListDialog from "@/components/listing-table/update-list-dialog"
import AuthLayout from "@/components/AuthLayout"

const updateListingStatusApi = (data: z.infer<typeof updateStatusSchema>) => {
  return axios.post("/api/listings/update-status", data)
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions)
  console.log("session on client", session)

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }
  const res = await axios.get("http://localhost:3000/api/listings")
  const listingRes: TListingResponse = res.data
  return { props: { listingRes } }
}

export default function DashboardPage({
  listingRes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [allListings, setAllListings] = useState(listingRes.listings)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TListings | null>(null)

  // Mutation for updating status of the list
  const mutation = useMutation({
    mutationFn: updateListingStatusApi,
    onError: (err: AxiosError<{ error: boolean; message: string }>) => {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Please try again"
      )
    },
    onSuccess: (res: AxiosResponse) => {
      toast.success("List has been updated successfully.")
      const updatedData = res.data.updatedListing
      const newUpdateList = allListings.map((list) =>
        list.id === updatedData.id ? updatedData : list
      )
      setAllListings(newUpdateList)
    },
  })

  const handleAction = async (
    action: "approve" | "reject" | "edit",
    listing: TListings
  ) => {
    if (action === "approve" || action === "reject") {
      mutation.mutate({
        id: listing.id,
        status: action,
      })
    } else {
      setSelectedItem(listing)
      setEditDialogOpen(true)
    }
  }

  return (
    <AuthLayout>
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-4">Rental Listing</h1>
        <DataTable
          columns={columns(handleAction, mutation.isPending)}
          data={allListings}
        />
        <UpdateListDialog
          open={editDialogOpen}
          listing={selectedItem}
          setSelectedItem={setSelectedItem}
          setEditDialogOpen={setEditDialogOpen}
          setAllListings={setAllListings}
        />
      </div>
    </AuthLayout>
  )
}
