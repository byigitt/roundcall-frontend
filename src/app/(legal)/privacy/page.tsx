import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-32 px-4 bg-gradient-to-b from-background to-muted relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072"
              alt="Privacy Policy"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <Badge className="mb-4" variant="secondary">Privacy Policy</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 p-2">
              Your Privacy Matters
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your data.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h1 className="text-3xl font-bold mb-8">Data Collection and Usage</h1>
              <p className="lead">
                We collect and process the following types of information:
              </p>

              <ul className="list-disc pl-6">
                <li>Account information (username, email, name)</li>
                <li>Training session data and performance metrics</li>
                <li>Usage statistics and interaction data</li>
                <li>Technical information for service improvement</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Data Protection</h2>
              <p>We implement robust security measures to protect your data:</p>

              <ul className="list-disc pl-6">
                <li>Password hashing using industry-standard algorithms</li>
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security audits and monitoring</li>
                <li>Strict access controls and authentication</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Data Storage</h2>
              <p>Your data is stored securely with the following considerations:</p>

              <ul className="list-disc pl-6">
                <li>Data is stored in secure, monitored facilities</li>
                <li>Regular backups are performed and encrypted</li>
                <li>Data retention policies are strictly enforced</li>
                <li>Personal data is segregated and protected</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Cookie Policy</h2>
              <p>We use cookies and similar technologies to:</p>

              <ul className="list-disc pl-6">
                <li>Maintain your session and authentication status</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage and performance</li>
                <li>Improve our services and user experience</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Your Rights</h2>
              <p>You have the following rights regarding your data:</p>

              <ul className="list-disc pl-6">
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to request data deletion</li>
                <li>Right to data portability</li>
                <li>Right to restrict processing</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Data Sharing</h2>
              <p>We only share your data in the following circumstances:</p>

              <ul className="list-disc pl-6">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>With service providers under strict confidentiality</li>
                <li>For essential platform functionality</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Security Measures</h2>
              <p>Our security infrastructure includes:</p>

              <ul className="list-disc pl-6">
                <li>JWT-based authentication with refresh tokens</li>
                <li>Role-based access control</li>
                <li>Rate limiting and DDoS protection</li>
                <li>Regular security updates and patches</li>
                <li>Continuous monitoring and threat detection</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Contact Information</h2>
              <p>For any privacy-related inquiries or requests, please contact:</p>

              <ul className="list-disc pl-6">
                <li>Email: <a href="mailto:privacy@roundcall.com" className="text-primary hover:underline">privacy@roundcall.com</a></li>
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