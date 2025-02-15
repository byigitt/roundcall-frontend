import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Phone } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const plans = [
  {
    name: "Starter",
    description: "Perfect for small call centers starting their training journey",
    price: "$299",
    billing: "per month",
    features: [
      "Up to 25 agents",
      "Basic call simulations",
      "Standard reporting",
      "Email support",
      "5 training modules",
      "Basic analytics",
    ],
    limitations: [
      "Limited customization",
      "Basic integrations only",
      "Community support",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=starter",
    popular: false,
  },
  {
    name: "Professional",
    description: "Ideal for growing call centers with advanced training needs",
    price: "$699",
    billing: "per month",
    features: [
      "Up to 100 agents",
      "Advanced call simulations",
      "Custom reporting",
      "Priority support",
      "Unlimited training modules",
      "Advanced analytics",
      "Custom scenarios",
      "API access",
      "Team collaboration tools",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=professional",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large-scale call center operations",
    price: "Custom",
    billing: "contact sales",
    features: [
      "Unlimited agents",
      "AI-powered simulations",
      "Custom integrations",
      "24/7 dedicated support",
      "White-label options",
      "Custom development",
      "On-premise deployment",
      "SLA guarantees",
      "Dedicated success manager",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
]

const additionalFeatures = [
  {
    category: "Training Features",
    features: [
      "Interactive voice simulations",
      "Real-time feedback system",
      "Custom scenario builder",
      "Progress tracking",
      "Certification management",
    ],
  },
  {
    category: "Analytics & Reporting",
    features: [
      "Performance dashboards",
      "Custom report builder",
      "Team analytics",
      "ROI tracking",
      "Improvement suggestions",
    ],
  },
  {
    category: "Support & Security",
    features: [
      "24/7 technical support",
      "Regular platform updates",
      "Data encryption",
      "GDPR compliance",
      "99.9% uptime SLA",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-32 px-4 bg-gradient-to-b from-background to-muted relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070"
              alt="Pricing background"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <Badge className="mb-4" variant="secondary">Flexible Pricing</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 p-2">
              Choose the Perfect Plan for Your Call Center
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Simple, transparent pricing that scales with your needs. Start free, upgrade when you're ready.
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-lg border bg-card p-6 ${
                    plan.popular
                      ? "border-primary shadow-lg scale-105"
                      : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="mb-6">
                    <div className="text-4xl font-bold">{plan.price}</div>
                    <div className="text-muted-foreground">{plan.billing}</div>
                  </div>
                  <div className="space-y-4 mb-6">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.limitations?.map((limitation) => (
                      <div key={limitation} className="flex items-center space-x-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{limitation}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={plan.href}>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4" variant="secondary">Features</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-muted-foreground">
                Comprehensive features designed for modern call center training
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {additionalFeatures.map((section) => (
                <div key={section.category}>
                  <h3 className="text-xl font-semibold mb-6">{section.category}</h3>
                  <ul className="space-y-4">
                    {section.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-16">
              <Badge className="mb-4" variant="secondary">FAQ</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Find answers to common questions about our pricing and features
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Can I switch plans later?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle. We'll prorate any payments for mid-cycle changes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                <AccordionContent>
                  We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and offer invoice-based payment for Enterprise plans. For annual subscriptions, we also accept bank transfers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Is there a setup fee?</AccordionTrigger>
                <AccordionContent>
                  No, there are no setup fees for Starter and Professional plans. Enterprise plans may include custom setup services based on your specific requirements and implementation needs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Do you offer a free trial?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer a 14-day free trial for all plans. No credit card required to start. You'll have full access to all features during the trial period to properly evaluate our platform.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>What happens after my free trial?</AccordionTrigger>
                <AccordionContent>
                  At the end of your trial, you can choose to subscribe to any of our plans. If you don't subscribe, your account will be automatically downgraded to a limited free version. Don't worry - your data will be preserved for 30 days.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Do you offer discounts for non-profits?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer special pricing for non-profit organizations and educational institutions. Contact our sales team with your organization's details to learn more about our discount programs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>What kind of support is included?</AccordionTrigger>
                <AccordionContent>
                  All plans include email support and access to our knowledge base. Professional plans include priority support with faster response times. Enterprise plans get 24/7 dedicated support and a dedicated success manager.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>Can I get a custom plan?</AccordionTrigger>
                <AccordionContent>
                  Yes, for organizations with specific needs, we offer custom plans under our Enterprise tier. This includes custom features, dedicated support, and flexible billing options. Contact our sales team to discuss your requirements.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Call Center Training?
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-black border-primary-foreground">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 