import { TListings } from "@/types/listing"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

export const columns = (
  handleActionClick: (
    action: "approve" | "reject" | "edit",
    data: TListings
  ) => void,
  isLoading: boolean
): ColumnDef<TListings>[] => [
  {
    accessorKey: "name",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const color = {
        approved: "green",
        pending: "yellow",
        rejected: "red",
      }[status]

      return (
        <Badge
          variant="outline"
          className={`border-${color}-500 text-${color}-600`}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const listing = row.original
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => handleActionClick("approve", listing)}
            variant="outline"
            size="sm"
            className="text-green-600 cursor-pointer"
            disabled={!!isLoading || listing.status === "approved"}
          >
            Approve
          </Button>
          <Button
            onClick={() => handleActionClick("reject", listing)}
            variant="outline"
            size="sm"
            className="text-red-600 cursor-pointer"
            disabled={!!isLoading || listing.status === "rejected"}
          >
            Reject
          </Button>
          <Button
            onClick={() => handleActionClick("edit", listing)}
            variant="outline"
            size="sm"
            className="text-blue-600 cursor-pointer"
            disabled={!!isLoading}
          >
            Edit
          </Button>
        </div>
      )
    },
  },
]
