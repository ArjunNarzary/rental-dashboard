import axios from "axios"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth"
import { DataTable } from "@/components/audit-table/data-table"
import { columns } from "@/components/audit-table/columns"
import AuthLayout from "@/components/AuthLayout"
import { authOptions } from "./api/auth/[...nextauth]"
import { TAuditResponse } from "@/types/audit"

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

  const res = await axios.get(`${process.env.BASE_URL}/api/audits`, {
    headers: {
      Cookie: context.req.headers.cookie || "",
    },
  })
  const auditRes: TAuditResponse = res.data
  return { props: { auditRes } }
}

export default function AuditsPage({
  auditRes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AuthLayout>
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-4">Action histotry</h1>
        <DataTable columns={columns()} data={auditRes.audits} />
      </div>
    </AuthLayout>
  )
}
