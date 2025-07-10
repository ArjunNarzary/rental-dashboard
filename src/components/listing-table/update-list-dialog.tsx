import { TListings } from "@/types/listing"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Dispatch, SetStateAction, useEffect } from "react"
import { updateListSchema } from "@/schemas/listing"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import axios, { AxiosError, AxiosResponse } from "axios"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type TUpdateListDialogProps = {
  open: boolean
  listing: TListings | null
  setSelectedItem: Dispatch<SetStateAction<TListings | null>>
  setEditDialogOpen: Dispatch<SetStateAction<boolean>>
  setAllListings: Dispatch<SetStateAction<TListings[]>>
}

const updateListApi = (data: z.infer<typeof updateListSchema>) => {
  return axios.post(`/api/listings/update/${data.id}`, data, { method: "PUT" })
}

export default function UpdateListDialog({
  open,
  listing,
  setSelectedItem,
  setEditDialogOpen,
  setAllListings,
}: TUpdateListDialogProps) {
  console.log(listing)
  const form = useForm<z.infer<typeof updateListSchema>>({
    resolver: zodResolver(updateListSchema),
    defaultValues: {
      id: "",
      name: "",
      price: 0,
      status: "pending",
    },
  })

  const mutation = useMutation({
    mutationFn: updateListApi,
    onError: (err: AxiosError<{ error: boolean; message: string }>) => {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Please try again"
      )
    },
    onSuccess: (res: AxiosResponse) => {
      toast.success("List has been updated successfully.")
      const updatedData = res.data.updatedList
      setAllListings((prev) =>
        prev.map((item) => {
          if (item.id === updatedData.id) {
            return updatedData
          }
          return item
        })
      )
      setEditDialogOpen(false)
    },
  })

  useEffect(() => {
    if (listing) {
      form.reset({
        id: listing?.id,
        name: listing?.name,
        price: listing?.price,
        status: listing?.status,
      })
    }
  }, [listing, form])

  const onSubmit = async (values: z.infer<typeof updateListSchema>) => {
    mutation.mutate(values)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setSelectedItem(null)
        setEditDialogOpen(false)
      }}
    >
      {/* <DialogTrigger asChild>
          <Button variant="outline">Share</Button>
        </DialogTrigger> */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update List</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="col-span-2 hidden">
                    <FormControl>
                      <Input
                        className="py-5"
                        placeholder="Email Address"
                        disabled={true}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-semibold">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="py-5"
                        placeholder="Car name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-semibold">Price</FormLabel>
                    <FormControl>
                      <Input
                        className="py-5"
                        placeholder="Enter price"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-semibold">Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full py-5">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                          <SelectItem value="approved">Approve</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4 pt-6">
              <Button
                type="submit"
                variant="default"
                disabled={form.formState.isSubmitting}
              >
                Update
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
