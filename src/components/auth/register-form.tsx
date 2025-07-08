import { registerUserSchema } from "@/schemas/user"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/router"
import PasswordInput from "./password-input"
import axios, { AxiosError } from "axios"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"

function registerApi(data: z.infer<typeof registerUserSchema>) {
  return axios.post("/api/auth/register", data)
}

export default function RegisterForm() {
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: registerApi,
    onError: (err: AxiosError<{ error: boolean; message: string }>) => {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Please try again"
      )
    },
  })
  const form = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof registerUserSchema>) => {
    mutation.mutate(values)
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success("User register successfully. Login now.")
      router.push("/login")
    }
  }, [mutation, router])

  return (
    <div className="w-full flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Name</FormLabel>
                <FormControl>
                  <Input
                    className="py-5 text-black"
                    placeholder="Full Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Email</FormLabel>
                <FormControl>
                  <Input
                    className="py-5 text-black"
                    placeholder="Email Address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={form.formState.isSubmitting || mutation.isPending}
            className="text-md h-10"
            type="submit"
          >
            Sign Up
          </Button>
        </form>
      </Form>
    </div>
  )
}
