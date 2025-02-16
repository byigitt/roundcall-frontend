"use client"

import { useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const { user, isLoading, error, setUser, setError, setLoading, initialize } = useUserStore()
  
  console.log("📊 Current State:", { 
    user: user ? `${user.email} (${user.role})` : null, 
    isLoading, 
    error,
    pathname 
  })

  const initializeUser = useCallback(async () => {
    console.log("🚀 Initializing User...")
    const { token, refreshToken } = getTokens();
    console.log("🔑 Token Status:", { 
      hasToken: !!token,
      hasRefreshToken: !!refreshToken
    })

    if (!token && !refreshToken) {
      console.log("❌ No tokens found - redirecting to signin")
      setLoading(false);
      router.push("/signin");
      return;
    }

    try {
      console.log("📡 Fetching user profile...")
      const userResponse = await getUserProfile();
      console.log("📥 User Response:", JSON.stringify(userResponse, null, 2))
      
      if (userResponse.status === "success" && userResponse.data) {
        console.log("✅ Setting user data:", userResponse.data.user)
        setUser(userResponse.data.user);
      } else {
        console.log("❌ Error from response:", userResponse.error)
        setError(userResponse.error?.message || "Failed to fetch user profile");
        if (userResponse.error?.code === "AUTH_001") {
          router.push("/signin");
        }
      }
    } catch (err) {
      console.log("💥 Error caught:", err)
      setError("Failed to fetch user profile");
      router.push("/signin");
    }
  }, [setUser, setError, setLoading, router]);

  useEffect(() => {
    if (!user && !isLoading && !error) {
      initialize();
    }
  }, [user, isLoading, error, initialize]);

  useEffect(() => {
    if (isLoading) {
      initializeUser();
    }
  }, [isLoading, initializeUser]);

  useEffect(() => {
    console.log("👀 Checking for redirect...", { isLoading, user, pathname })
    // Only redirect if we're exactly on /dashboard
    if (!isLoading && user && pathname === "/dashboard") {
      if (user.role.toLowerCase() === "trainer" || user.role.toLowerCase() === "admin") {
        console.log("🔄 Redirecting to /dashboard/manage")
        router.replace("/dashboard/manage")
      } else if (user.role.toLowerCase() === "trainee") {
        console.log("🔄 Redirecting to /dashboard/practice")
        router.replace("/dashboard/practice")
      }
    }
  }, [user, isLoading, router, pathname])

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

  // If we're not on /dashboard exactly, don't redirect
  if (pathname !== "/dashboard") {
    return null;
  }

  console.log("✨ Rendering null while redirecting")
  // Return null while redirecting to prevent flash of content
  return null;
} 