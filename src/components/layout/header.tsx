"use client"

import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function Header() {
  return (
    <header className="fixed w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo - Fixed width */}
        <div className="w-[180px]">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Phone className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RoundCall</span>
          </Link>
        </div>

        {/* Navigation - Centered */}
        <div className="flex-1 flex justify-center">
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Auth Buttons - Fixed width */}
        <div className="w-[180px] flex justify-end">
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <Link href="/signin">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
} 