import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function SecurityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-32 px-4 bg-gradient-to-b from-background to-muted relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070"
              alt="Security"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <Badge className="mb-4" variant="secondary">Security</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 p-2">
              Our Security Commitment
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your security is our top priority. Learn about our comprehensive security measures.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h1 className="text-3xl font-bold mb-8">Authentication & Authorization</h1>
              <p className="lead text-lg">
                We implement robust security measures to protect your account and data:
              </p>

              <ul className="list-disc pl-6">
                <li>JWT-based authentication with 1-hour access tokens</li>
                <li>24-hour refresh tokens for extended sessions</li>
                <li>Role-based access control (RBAC) for granular permissions</li>
                <li>Secure password hashing using industry-standard algorithms</li>
                <li>Token invalidation on password change</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Data Protection</h2>
              <p>Your data is protected through multiple layers of security:</p>

              <ul className="list-disc pl-6">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure data transmission using TLS 1.3</li>
                <li>Regular security audits and penetration testing</li>
                <li>Automated threat detection and prevention</li>
                <li>Secure data backups with encryption</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">API Security</h2>
              <p>Our API is secured through comprehensive measures:</p>

              <ul className="list-disc pl-6">
                <li>Rate limiting to prevent abuse (100 requests per 15 minutes)</li>
                <li>Input validation and sanitization</li>
                <li>Detailed error handling with specific error codes</li>
                <li>Secure token management</li>
                <li>Regular security assessments</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Infrastructure Security</h2>
              <p>Our infrastructure is designed with security in mind:</p>

              <ul className="list-disc pl-6">
                <li>Cloud security best practices implementation</li>
                <li>Regular security patches and updates</li>
                <li>Network segmentation and firewall protection</li>
                <li>24/7 infrastructure monitoring</li>
                <li>Disaster recovery procedures</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Compliance Standards</h2>
              <p>We maintain compliance with industry standards:</p>

              <ul className="list-disc pl-6">
                <li>GDPR compliance for EU data protection</li>
                <li>Regular compliance audits</li>
                <li>Industry-standard security certifications</li>
                <li>Transparent security practices</li>
                <li>Regular staff security training</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Error Handling</h2>
              <p>Our error handling system includes:</p>

              <ul className="list-disc pl-6">
                <li>Specific error codes for different scenarios</li>
                <li>Detailed error messages for debugging</li>
                <li>Secure error logging and monitoring</li>
                <li>Rate limit headers in responses</li>
                <li>Graceful error recovery</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Incident Response</h2>
              <p>Our incident response plan includes:</p>

              <ul className="list-disc pl-6">
                <li>24/7 security team availability</li>
                <li>Automated incident detection</li>
                <li>Rapid response procedures</li>
                <li>Regular incident response drills</li>
                <li>Post-incident analysis and improvements</li>
              </ul>

              <h2 className="text-2xl font-bold mt-12 mb-4">Reporting Security Issues</h2>
              <p>If you discover a security vulnerability:</p>

              <ul className="list-disc pl-6">
                <li>Email: <a href="mailto:security@roundcall.com" className="text-primary hover:underline">security@roundcall.com</a></li>
                <li>Responsible disclosure program with bug bounties</li>
                <li>Acknowledgment of security researchers</li>
                <li>Timely response to security reports</li>
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