"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useUserStore } from "@/lib/store/use-user-store"
import { getUserProfile } from "@/lib/auth/user-service"
import { getTokens } from "@/lib/auth/tokens"

export default function DashboardPage() {
  console.log("🔄 Dashboard Page Rendered")
  
  const router = useRouter()
  const { user, isLoading, error, setUser, setError, setLoading } = useUserStore()
  
  console.log("📊 Current State:", { 
    user: user ? `${user.email} (${user.role})` : null, 
    isLoading, 
    error 
  })

  const initializeUser = useCallback(async () => {
    console.log("🚀 Initializing User...")
    const { token } = getTokens();
    console.log("🔑 Token exists:", !!token)

    if (!token) {
      console.log("❌ No token found")
      setLoading(false);
      return;
    }

    try {
      console.log("📡 Fetching user profile...")
      const userResponse = await getUserProfile();
      console.log("📥 User Response:", userResponse)
      
      if (userResponse.status === "success" && userResponse.data) {
        console.log("✅ Setting user data")
        setUser(userResponse.data.user);
      } else {
        console.log("❌ Setting error from response")
        setError(userResponse.message || "Failed to fetch user profile");
      }
    } catch (err) {
      console.log("💥 Error caught:", err)
      setError("Failed to fetch user profile");
    } finally {
      console.log("⏳ Setting loading to false")
      setLoading(false);
    }
  }, [setUser, setError, setLoading]);

  useEffect(() => {
    if (isLoading) {
      initializeUser();
    }
  }, [isLoading, initializeUser]);

  useEffect(() => {
    console.log("👀 Checking for redirect...", { isLoading, user })
    if (!isLoading && user) {
      if (user.role === "trainer" || user.role === "admin") {
        console.log("🔄 Redirecting to /dashboard/manage")
        router.replace("/dashboard/manage")
      } else if (user.role === "trainee") {
        console.log("🔄 Redirecting to /dashboard/practice")
        router.replace("/dashboard/practice")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    console.log("⌛ Rendering loading state")
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    console.log("❌ Rendering error state:", error)
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center space-y-4">
        <p className="text-destructive font-semibold">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (!user) {
    console.log("👤 Rendering no-user state")
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center space-y-4">
        <p className="text-muted-foreground">Please sign in to access the dashboard.</p>
        <Button onClick={() => router.push("/signin")}>
          Go to Sign In
        </Button>
      </div>
    )
  }

  console.log("✨ Rendering null while redirecting")
  // Return null while redirecting to prevent flash of content
  return null;
} 