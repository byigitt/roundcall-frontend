import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function GDPRPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-32 px-4 bg-gradient-to-b from-background to-muted relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070"
              alt="GDPR"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <Badge className="mb-4" variant="secondary">GDPR</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 p-2">
              GDPR Compliance
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Understanding your rights and how we protect your data under GDPR.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h1 className="text-3xl font-bold mb-8">Your Rights Under GDPR</h1>
              <p className="lead text-lg">
                Under the General Data Protection Regulation (GDPR), you have the following rights:
              </p>

              <ul className="list-disc pl-6">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Rights related to automated decision making</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Data Processing Principles</h2>
              <p>We process your data according to these GDPR principles:</p>

              <ul className="list-disc pl-6">
                <li>Lawfulness, fairness, and transparency</li>
                <li>Purpose limitation</li>
                <li>Data minimization</li>
                <li>Accuracy</li>
                <li>Storage limitation</li>
                <li>Integrity and confidentiality</li>
                <li>Accountability</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Data We Collect</h2>
              <p>We collect and process the following types of personal data:</p>

              <ul className="list-disc pl-6">
                <li>Account information (name, email, phone number)</li>
                <li>Usage data and analytics</li>
                <li>Communication records</li>
                <li>Technical data (IP address, browser information)</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Legal Basis for Processing</h2>
              <p>We process your data under these legal bases:</p>

              <ul className="list-disc pl-6">
                <li>Contract fulfillment</li>
                <li>Legal obligations</li>
                <li>Legitimate interests</li>
                <li>Consent (where required)</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Data Protection Measures</h2>
              <p>We protect your data through:</p>

              <ul className="list-disc pl-6">
                <li>End-to-end encryption</li>
                <li>Secure data storage</li>
                <li>Access controls</li>
                <li>Regular security audits</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">International Data Transfers</h2>
              <p>For international data transfers:</p>

              <ul className="list-disc pl-6">
                <li>Standard contractual clauses</li>
                <li>Adequate safeguards</li>
                <li>Privacy Shield compliance</li>
                <li>Data transfer impact assessments</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Data Retention</h2>
              <p>Our data retention policies:</p>

              <ul className="list-disc pl-6">
                <li>Retention periods based on purpose</li>
                <li>Regular data review and cleanup</li>
                <li>Secure data deletion procedures</li>
                <li>Documentation of retention decisions</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Your Data Protection Rights</h2>
              <p>How to exercise your rights:</p>

              <ul className="list-disc pl-6">
                <li>Contact our Data Protection Officer</li>
                <li>Submit a subject access request</li>
                <li>Request data deletion</li>
                <li>Object to data processing</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Data Breach Procedures</h2>
              <p>In case of a data breach:</p>

              <ul className="list-disc pl-6">
                <li>72-hour notification requirement</li>
                <li>Impact assessment procedures</li>
                <li>Communication to affected users</li>
                <li>Remediation measures</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Contact Information</h2>
              <p>For GDPR-related inquiries:</p>

              <ul className="list-disc pl-6">
                <li>Data Protection Officer: <a href="mailto:dpo@roundcall.com" className="text-primary hover:underline">dpo@roundcall.com</a></li>
                <li>EU Representative: [Representative Details]</li>
                <li>Supervisory Authority: [Authority Details]</li>
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