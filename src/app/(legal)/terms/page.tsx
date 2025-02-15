import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-32 px-4 bg-gradient-to-b from-background to-muted relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070"
              alt="Terms of Service"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <Badge className="mb-4" variant="secondary">Terms of Service</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 p-2">
              Terms and Conditions
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Please read these terms carefully before using our platform.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h1 className="text-3xl font-bold mb-8">Account Terms</h1>
              <p className="lead text-lg">
                By creating an account on RoundCall, you agree to:
              </p>

              <ul className="list-disc pl-6">
                <li>Provide accurate and complete registration information</li>
                <li>Username must be 3-20 characters, alphanumeric and underscores only</li>
                <li>Email must be valid and unique</li>
                <li>Password must be at least 8 characters with uppercase, lowercase, number, and special character</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Take responsibility for all activities under your account</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Service Terms</h2>
              <p>Our service terms include:</p>

              <ul className="list-disc pl-6">
                <li>14-day free trial period with full access</li>
                <li>Subscription-based access to features</li>
                <li>99.9% uptime guarantee for all services</li>
                <li>Regular maintenance windows with advance notice</li>
                <li>Data backup and recovery procedures</li>
                <li>No credit card required for trial</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">API Usage</h2>
              <p>When using our API, you must:</p>

              <ul className="list-disc pl-6">
                <li>Respect rate limiting guidelines (100 requests per 15 minutes)</li>
                <li>Implement proper error handling</li>
                <li>Maintain secure token management</li>
                <li>Follow API documentation guidelines</li>
                <li>Use appropriate authentication methods</li>
                <li>Handle pagination appropriately</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Data Usage</h2>
              <p>Regarding data usage:</p>

              <ul className="list-disc pl-6">
                <li>Data will be processed according to our privacy policy</li>
                <li>Customer data remains their property</li>
                <li>Backups are maintained for disaster recovery</li>
                <li>Data retention follows legal requirements</li>
                <li>Data is processed in compliance with GDPR</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Service Level Agreement</h2>
              <p>We commit to:</p>

              <ul className="list-disc pl-6">
                <li>99.9% uptime guarantee</li>
                <li>Response time standards for support</li>
                <li>Regular maintenance windows</li>
                <li>Incident response procedures</li>
                <li>Performance monitoring and optimization</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Termination</h2>
              <p>Account termination may occur:</p>

              <ul className="list-disc pl-6">
                <li>At user request with data export option</li>
                <li>For terms violation after warning</li>
                <li>Due to extended inactivity (90+ days)</li>
                <li>For non-payment of services</li>
                <li>By mutual agreement</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Intellectual Property</h2>
              <p>Intellectual property terms:</p>

              <ul className="list-disc pl-6">
                <li>Platform content and code is our property</li>
                <li>User-generated content remains user property</li>
                <li>Limited license granted for platform use</li>
                <li>Trademark and copyright protection</li>
                <li>No unauthorized use of our IP</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Liability</h2>
              <p>Limitation of liability:</p>

              <ul className="list-disc pl-6">
                <li>Service provided "as is" without warranty</li>
                <li>No guarantee for uninterrupted service</li>
                <li>Limited liability for damages</li>
                <li>Force majeure conditions</li>
                <li>Indemnification requirements</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Changes to Terms</h2>
              <p>We reserve the right to modify these terms:</p>

              <ul className="list-disc pl-6">
                <li>30-day notice for material changes</li>
                <li>Immediate effect for minor updates</li>
                <li>Email notification for significant changes</li>
                <li>Continued use implies acceptance</li>
                <li>Option to terminate if terms unacceptable</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Contact Information</h2>
              <p>For questions about these terms:</p>

              <ul className="list-disc pl-6">
                <li>Email: <a href="mailto:legal@roundcall.com" className="text-primary hover:underline">legal@roundcall.com</a></li>
                <li>Address: [Company Address]</li>
                <li>Phone: [Contact Number]</li>
              </ul>

              <div className="mt-16 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  Last updated: March 2024
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 