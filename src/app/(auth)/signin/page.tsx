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
import { login } from "@/lib/auth/auth-service"
import { getUserProfile } from "@/lib/auth/user-service"
import { useUserStore } from "@/lib/store/use-user-store"

const signInSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address.")
    .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

type SignInFormValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const { setUser, clearUser } = useUserStore()

  React.useEffect(() => {
    // Clear any existing user state when mounting the sign-in page
    clearUser()
  }, [clearUser])

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: SignInFormValues) {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await login(data)
      console.log("🔐 Login Response in SignIn:", response)
      
      if (response.status === 'success' && response.data) {
        console.log("👤 User data:", response.data.user)
        setUser(response.data.user)
        
        toast({
          title: "Welcome back",
          description: "You have successfully signed in.",
        })

        // Use replace instead of push to prevent back button issues
        console.log("🚀 Redirecting based on role:", response.data.user.role)
        const targetPath = response.data.user.role.toLowerCase() === "trainer" 
          ? "/dashboard/manage" 
          : "/dashboard/practice"
        
        console.log("📍 Target path:", targetPath)
        try {
          await router.replace(targetPath)
          console.log("✅ Navigation completed")
        } catch (navError) {
          console.error("❌ Navigation failed:", navError)
          // Fallback to window.location if router fails
          window.location.href = targetPath
        }
      } else {
        console.log("❌ Login failed:", response.error)
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error?.message || "Invalid credentials.",
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error("💥 Submit error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your call center training account
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
                      disabled={isLoading}
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
} 