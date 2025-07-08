import axios from "axios"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"
import authOptions from "../api/auth/[...nextauth]"

interface IListings {
  id: string
  name: string
  status: "pending" | "reject" | "approve"
  createdAt: Date
  updatedAt: Date
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }
  const res = await axios.get("/api/listings")
  const listings: IListings[] = res.data
  return { props: { listings } }
}

export function dashboardPage({
  listings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(listings)
  return <div>Dashboard</div>
}
