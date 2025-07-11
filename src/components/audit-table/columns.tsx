import { TAudit } from "@/types/audit"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns = (): ColumnDef<TAudit>[] => [
  {
    accessorKey: "list.name",
    header: "List Name",
  },
  {
    id: "admin_name",
    accessorKey: "user.name",
    header: "Admin Name",
  },
  {
    accessorKey: "user.email",
    header: "Admin Email",
  },
  {
    accessorKey: "action",
    header: "Action Taken",
    cell: ({ row }) => {
      const action = row.getValue("action") as string
      const formatted = `${action.charAt(0).toUpperCase() + action.slice(1)}`
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const currDate = new Date(row.getValue("createdAt"))
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(currDate)
      return <div className="font-medium">{formatted}</div>
    },
  },
]
