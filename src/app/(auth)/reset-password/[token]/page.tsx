"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { confirmResetPassword } from "@/lib/auth/auth-service"

const resetConfirmSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ResetConfirmFormValues = z.infer<typeof resetConfirmSchema>

export default async function ResetPasswordConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const param = await params
  const form = useForm<ResetConfirmFormValues>({
    resolver: zodResolver(resetConfirmSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: ResetConfirmFormValues) {
    startTransition(async () => {
      try {
        const response = await confirmResetPassword({
          token: param.token,
          password: data.password,
        })
        
        if (response.status === "success") {
          toast({
            title: "Success",
            description: response.message,
          })
          // Redirect to sign in page after a short delay
          setTimeout(() => router.push("/signin"), 2000)
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error?.message || "Failed to reset password.",
          })
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again.",
        })
      }
    })
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Reset password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect="off"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect="off"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset password
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground text-center w-full">
          Remember your password?{" "}
          <Link href="/signin" className="hover:text-primary">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
} 