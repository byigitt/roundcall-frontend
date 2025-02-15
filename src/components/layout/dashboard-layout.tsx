"use client"

import { useEffect } from "react"
import { Phone, LayoutDashboard, GraduationCap, BarChart2, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/lib/store/use-user-store"
import { logout } from "@/lib/auth/auth-service"

const navigation = [
  {
    title: "Manage",
    href: "/dashboard/manage",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["admin", "trainer"]
  },
  {
    title: "Practice",
    href: "/dashboard/practice",
    icon: <GraduationCap className="h-5 w-5" />,
    roles: ["trainee"]
  },
  {
    title: "Performance",
    href: "/dashboard/performance",
    icon: <BarChart2 className="h-5 w-5" />,
    roles: ["admin", "trainer", "trainee"]
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, clearUser } = useUserStore()

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!isLoading && !user) {
      router.push('/signin')
    }
  }, [user, isLoading, router])

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  )

  const handleLogout = async () => {
    await logout()
    clearUser()
    router.push('/signin')
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render anything if there's no user
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 z-50 w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="h-16 border-b flex items-center px-6">
            <Link href="/" className="flex items-center space-x-2">
              <Phone className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">RoundCall</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <div className="space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Profile & Sign Out */}
          <div className="border-t p-4">
            <div className="space-y-2">
              <Link href="/profile">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-primary"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        <div className="container py-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
} 