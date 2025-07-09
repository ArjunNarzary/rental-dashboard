import LoginForm from "@/components/auth/login-form"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"

export default function LoginPage() {
  const router = useRouter()
  const session = useSession()

  if (session.data) {
    router.push("/")
  }
  return (
    <div className="flex h-screen w-screen flex-col items-center gap-4">
      <Link className="absolute left-1/2 top-4 z-10 -translate-x-1/2" href="/">
        <h1 className="text-2xl font-bold py-5">Car Rental Admin Dashboard</h1>
      </Link>

      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-sm h-screen">
        <h2 className="text-2xl font-bold py-4">Login to your account</h2>
        <div className="flex flex-col gap-3 w-full">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm font-medium text-neutral-500">
          Don&apos;t have an account?&nbsp;
          <Link
            className="font-semibold text-neutral-700 transition-colors hover:text-neutral-900"
            href="/register"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
