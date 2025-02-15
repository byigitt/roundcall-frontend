import { Button } from '@/components/ui/button'
import { 
  ArrowRight, Phone, BarChart, GraduationCap, Users, 
  CheckCircle2, Star, Award, Headphones, Globe2, 
  BarChart3, Clock, Shield, Settings, Zap, MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Footer } from "@/components/layout/footer"

const companyLogos = [
  {
    name: "Google",
    logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    description: "Leading search and cloud technology provider",
    industry: "Technology"
  },
  {
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png",
    description: "Social media and metaverse pioneer",
    industry: "Social Media"
  },
  {
    name: "X",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/300px-X_logo_2023.svg.png",
    description: "Real-time global communication platform",
    industry: "Social Media"
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png",
    description: "Enterprise software and cloud solutions",
    industry: "Technology"
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
    description: "E-commerce and cloud computing leader",
    industry: "Technology"
  }
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Phone className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RoundCall</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
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
          <div className="flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-32 px-4 bg-gradient-to-b from-background to-muted relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=2070"
              alt="Call center background"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <Badge className="mb-4" variant="secondary">Trusted by 200+ Companies Worldwide</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 p-2">
              Transform Your Call Center Training
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Empower your customer service team with our comprehensive training platform. 
              Build skills, boost confidence, and deliver exceptional customer experiences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-12">TRUSTED BY LEADING COMPANIES</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
              {companyLogos.map((company) => (
                <HoverCard key={company.name}>
                  <HoverCardTrigger asChild>
                    <div className="relative h-8 w-32 mx-auto grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105 rounded-lg p-2 bg-white/50 backdrop-blur-sm">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-contain w-12 h-12"
                        unoptimized
                      />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{company.name}</h4>
                        <p className="text-sm text-muted-foreground">{company.description}</p>
                        <div className="flex items-center pt-2">
                          <Badge variant="secondary">{company.industry}</Badge>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section with Image */}
        <section className="py-32 px-4 relative">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="mb-4" variant="secondary">Features</Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Everything You Need for Call Center Excellence
                </h2>
                <p className="text-muted-foreground mb-8">
                  Comprehensive tools and features designed specifically for modern call center training needs.
                </p>
                <div className="grid gap-6">
                  <FeatureCard
                    icon={<GraduationCap className="h-8 w-8" />}
                    title="Interactive Training"
                    description="Comprehensive modules designed for real-world scenarios"
                  />
                  <FeatureCard
                    icon={<Phone className="h-8 w-8" />}
                    title="Call Simulations"
                    description="Practice with realistic customer interactions"
                  />
                  <FeatureCard
                    icon={<BarChart className="h-8 w-8" />}
                    title="Performance Tracking"
                    description="Detailed analytics and progress monitoring"
                  />
                </div>
              </div>
              <div className="relative h-[600px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974"
                  alt="Call center training"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section with Image */}
        <section className="py-32 px-4 bg-muted/30 relative">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative h-[600px] rounded-lg overflow-hidden order-2 md:order-1">
                <Image
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070"
                  alt="Team collaboration"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="order-1 md:order-2">
                <Badge className="mb-4" variant="secondary">How It Works</Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Simple Yet Powerful Training Process
                </h2>
                <p className="text-muted-foreground mb-8">
                  Our platform makes it easy to implement effective call center training.
                </p>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                    <div>
                      <h3 className="font-semibold mb-2">Create Training Programs</h3>
                      <p className="text-muted-foreground">Design custom training modules tailored to your needs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                    <div>
                      <h3 className="font-semibold mb-2">Train & Practice</h3>
                      <p className="text-muted-foreground">Interactive learning with real-world scenarios</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                    <div>
                      <h3 className="font-semibold mb-2">Track & Improve</h3>
                      <p className="text-muted-foreground">Monitor progress and optimize performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4" variant="secondary">Benefits</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Why Companies Choose RoundCall
              </h2>
              <p className="text-muted-foreground">
                Join hundreds of companies that have transformed their call center training.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <BenefitCard
                icon={<Star className="h-6 w-6" />}
                title="Improved Customer Satisfaction"
                description="On average, companies see a 35% increase in customer satisfaction scores after implementing RoundCall."
              />
              <BenefitCard
                icon={<Clock className="h-6 w-6" />}
                title="Reduced Training Time"
                description="Cut training time by up to 50% while improving knowledge retention and performance."
              />
              <BenefitCard
                icon={<Award className="h-6 w-6" />}
                title="Higher Agent Confidence"
                description="Agents report feeling 85% more confident in handling customer interactions."
              />
              <BenefitCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Increased Efficiency"
                description="Reduce average handle time by 25% through better training and preparation."
              />
              <BenefitCard
                icon={<Headphones className="h-6 w-6" />}
                title="Better Call Quality"
                description="Improve first-call resolution rates by up to 40% with comprehensive training."
              />
              <BenefitCard
                icon={<Globe2 className="h-6 w-6" />}
                title="Global Accessibility"
                description="Train teams across multiple locations with our cloud-based platform."
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-primary">95%</h3>
                <p className="text-muted-foreground">Customer Satisfaction</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-primary">50K+</h3>
                <p className="text-muted-foreground">Trained Agents</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-primary">200+</h3>
                <p className="text-muted-foreground">Companies Trust Us</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-primary">40%</h3>
                <p className="text-muted-foreground">Efficiency Increase</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4" variant="secondary">Comprehensive Platform</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Powerful Features for Modern Call Centers
              </h2>
              <p className="text-muted-foreground">
                Everything you need to train and manage your call center team effectively.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <DetailedFeatureCard
                icon={<MessageSquare className="h-6 w-6" />}
                title="Smart Conversation Simulator"
                description="Practice real customer interactions with AI-powered conversation scenarios."
                features={[
                  "Natural language processing",
                  "Custom scenario builder",
                  "Real-time feedback",
                  "Voice recognition"
                ]}
              />
              <DetailedFeatureCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Advanced Analytics"
                description="Track and measure every aspect of your training program."
                features={[
                  "Performance dashboards",
                  "Custom reports",
                  "Team comparisons",
                  "Progress tracking"
                ]}
              />
              <DetailedFeatureCard
                icon={<Settings className="h-6 w-6" />}
                title="Customization Tools"
                description="Tailor the platform to match your specific needs."
                features={[
                  "Custom workflows",
                  "Branded interface",
                  "Integration options",
                  "API access"
                ]}
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4" variant="secondary">Testimonials</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-muted-foreground">
                See what our customers have to say about RoundCall.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="RoundCall has transformed how we train our customer service team. The results have been outstanding."
                author="Sarah Johnson"
                role="Customer Service Director"
                company="Tech Corp"
              />
              <TestimonialCard
                quote="The simulation features are incredibly realistic. Our agents are better prepared than ever."
                author="Michael Chen"
                role="Training Manager"
                company="Global Services Inc"
              />
              <TestimonialCard
                quote="The analytics and reporting features have helped us identify and address training gaps effectively."
                author="Emma Williams"
                role="Operations Manager"
                company="Support Solutions"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Call Center Training?
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Join leading companies that have revolutionized their customer service training with RoundCall.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
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

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card hover:bg-muted/50 transition-colors border">
      <div className="mb-4 text-primary bg-primary/10 p-3 rounded-lg">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-lg bg-card border hover:shadow-md transition-all">
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-primary bg-primary/10 p-2 rounded-lg">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function DetailedFeatureCard({
  icon,
  title,
  description,
  features,
}: {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
}) {
  return (
    <div className="p-6 rounded-lg bg-card border hover:shadow-md transition-all">
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-primary bg-primary/10 p-2 rounded-lg">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
  company,
}: {
  quote: string
  author: string
  role: string
  company: string
}) {
  return (
    <div className="p-6 rounded-lg bg-card border hover:shadow-md transition-all">
      <div className="mb-4 text-primary">
        <Star className="h-6 w-6" />
      </div>
      <blockquote className="text-lg mb-4">{quote}</blockquote>
      <div>
        <div className="font-semibold">{author}</div>
        <div className="text-sm text-muted-foreground">{role}</div>
        <div className="text-sm text-muted-foreground">{company}</div>
      </div>
    </div>
  )
}
