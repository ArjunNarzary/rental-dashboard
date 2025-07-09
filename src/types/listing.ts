export type TListings = {
  id: string
  name: string
  price: number
  status: "pending" | "rejected" | "approved"
  createdAt: Date
  updatedAt: Date
}

export type TListingResponse = {
  listings: TListings[]
}
