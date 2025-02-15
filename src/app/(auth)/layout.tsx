import { Phone } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 border-b px-4 flex items-center">
        <div className="container flex items-center max-w-lg mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <Phone className="h-6 w-6 text-primary" />
            <span className="font-semibold">RoundCall</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-14 border-t px-4 flex items-center">
        <div className="container flex justify-between items-center max-w-lg mx-auto text-sm text-muted-foreground">
          <span>© 2024 RoundCall</span>
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
