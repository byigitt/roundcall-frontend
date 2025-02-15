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
import { resetPassword } from "@/lib/auth/auth-service"

const resetSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address.")
    .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Invalid email format"),
})

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ResetFormValues) {
    startTransition(async () => {
      try {
        const response = await resetPassword(data.email)
        
        if (response.status === "success") {
          toast({
            title: "Check your email",
            description: response.message,
          })
          // Redirect to sign in page after a short delay
          setTimeout(() => router.push("/signin"), 2000)
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error?.message || "Failed to send reset link.",
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
          Enter your email address and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
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
              Send reset link
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