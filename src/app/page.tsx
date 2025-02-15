import { Button } from '@/components/ui/button'
import { 
  ArrowRight, Phone, BarChart, GraduationCap, Users, 
  CheckCircle2, Star, Award, Headphones, Globe2, 
  BarChart3, Clock, Shield, Settings, Zap, MessageSquare,
  Sun, Moon
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
import { Header } from "@/components/layout/header"
import { ThemeSwitcher } from "@/components/theme-switcher"

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
    darkModeLogo: '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 462.799"><path fill="#fff" fill-rule="nonzero" d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"/></svg>',
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
    darkModeLogo: '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 465.46"><path fill="#fff" fill-rule="nonzero" d="M141.03 228.54c0-21.41 5.28-39.72 15.83-54.92 10.55-15.21 24.98-26.69 43.29-34.45 16.75-7.13 37.39-12.25 61.9-15.36 8.38-.93 22.03-2.17 40.96-3.72v-7.91c0-19.86-2.17-33.21-6.51-40.03-6.52-9.31-16.76-13.97-30.73-13.97h-3.72c-10.24.93-19.08 4.19-26.53 9.78-7.45 5.58-12.26 13.34-14.43 23.27-1.24 6.21-4.34 9.77-9.31 10.71l-53.53-6.52c-5.27-1.24-7.91-4.03-7.91-8.38 0-.93.16-2.02.47-3.26 5.27-27.61 18.23-48.09 38.86-61.44C210.31 9 234.43 1.55 262.05 0h11.64c35.37 0 62.99 9.15 82.85 27.46 3.11 3.12 5.99 6.46 8.61 10.01 2.64 3.57 4.73 6.75 6.28 9.54 1.56 2.79 2.95 6.83 4.19 12.1 1.24 5.28 2.17 8.93 2.8 10.94.62 2.02 1.08 6.36 1.39 13.04.31 6.67.47 10.62.47 11.86v112.64c0 8.07 1.16 15.44 3.49 22.11 2.32 6.68 4.58 11.48 6.75 14.43 2.17 2.95 5.74 7.68 10.7 14.2 1.86 2.79 2.8 5.27 2.8 7.45 0 2.48-1.25 4.65-3.73 6.51-25.76 22.35-39.72 34.45-41.89 36.31-3.72 2.79-8.22 3.1-13.5.93-4.34-3.73-8.14-7.29-11.4-10.71-3.26-3.41-5.59-5.89-6.98-7.44-1.4-1.56-3.65-4.58-6.75-9.08-3.11-4.5-5.28-7.52-6.52-9.08-17.38 18.93-34.44 30.72-51.2 35.38-10.55 3.1-23.58 4.65-39.1 4.65-23.89 0-43.52-7.37-58.88-22.11-15.36-14.74-23.04-35.6-23.04-62.6zm275.55 140.57c.62-1.24 1.55-2.49 2.8-3.73 7.75-5.27 15.2-8.84 22.34-10.7 11.79-3.1 23.27-4.81 34.44-5.12 3.1-.31 6.05-.16 8.84.46 13.97 1.24 22.35 3.57 25.14 6.98 1.24 1.87 1.86 4.66 1.86 8.38v3.26c0 10.86-2.95 23.66-8.84 38.4-5.9 14.74-14.12 26.61-24.67 35.61-1.55 1.24-2.95 1.86-4.19 1.86-.62 0-1.24-.15-1.86-.46-1.86-.93-2.33-2.64-1.4-5.13 11.48-26.99 17.22-45.76 17.22-56.31 0-3.42-.62-5.9-1.86-7.45-3.1-3.72-11.79-5.59-26.06-5.59-5.28 0-11.49.31-18.62.93-7.76.94-14.9 1.86-21.42 2.8-1.86 0-3.1-.31-3.72-.94-.62-.62-.77-1.24-.46-1.86 0-.31.15-.77.46-1.39zM.93 361.2c1.55-2.49 4.03-2.64 7.45-.47 77.57 44.99 161.98 67.49 253.21 67.49 60.81 0 120.86-11.33 180.13-33.98 1.55-.62 3.8-1.55 6.75-2.79s5.04-2.17 6.28-2.79c4.65-1.86 8.3-.93 10.94 2.79 2.64 3.72 1.78 7.14-2.56 10.24-5.59 4.03-12.73 8.69-21.41 13.96-26.69 15.83-56.48 28.09-89.37 36.77-32.89 8.69-65.01 13.04-96.35 13.04-48.41 0-94.18-8.46-137.31-25.37-43.13-16.91-81.77-40.73-115.9-71.45-1.86-1.55-2.79-3.1-2.79-4.65 0-.93.31-1.87.93-2.79zm220.16-141.97c0 12.1 3.03 21.8 9.08 29.09 6.05 7.29 14.19 10.94 24.43 10.94.93 0 2.25-.16 3.96-.47 1.71-.31 2.87-.46 3.49-.46 13.03-3.41 23.12-11.79 30.25-25.13 3.42-5.9 5.98-12.34 7.68-19.32 1.71-6.98 2.64-12.65 2.8-16.99.15-4.35.23-11.48.23-21.41v-11.64c-18 0-31.65 1.24-40.96 3.72-27.31 7.76-40.96 24.98-40.96 51.67z"/></svg>',
    logo: '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 465.46"><path fill-rule="nonzero" d="M141.03 228.54c0-21.41 5.28-39.72 15.83-54.92 10.55-15.21 24.98-26.69 43.29-34.45 16.75-7.13 37.39-12.25 61.9-15.36 8.38-.93 22.03-2.17 40.96-3.72v-7.91c0-19.86-2.17-33.21-6.51-40.03-6.52-9.31-16.76-13.97-30.73-13.97h-3.72c-10.24.93-19.08 4.19-26.53 9.78-7.45 5.58-12.26 13.34-14.43 23.27-1.24 6.21-4.34 9.77-9.31 10.71l-53.53-6.52c-5.27-1.24-7.91-4.03-7.91-8.38 0-.93.16-2.02.47-3.26 5.27-27.61 18.23-48.09 38.86-61.44C210.31 9 234.43 1.55 262.05 0h11.64c35.37 0 62.99 9.15 82.85 27.46 3.11 3.12 5.99 6.46 8.61 10.01 2.64 3.57 4.73 6.75 6.28 9.54 1.56 2.79 2.95 6.83 4.19 12.1 1.24 5.28 2.17 8.93 2.8 10.94.62 2.02 1.08 6.36 1.39 13.04.31 6.67.47 10.62.47 11.86v112.64c0 8.07 1.16 15.44 3.49 22.11 2.32 6.68 4.58 11.48 6.75 14.43 2.17 2.95 5.74 7.68 10.7 14.2 1.86 2.79 2.8 5.27 2.8 7.45 0 2.48-1.25 4.65-3.73 6.51-25.76 22.35-39.72 34.45-41.89 36.31-3.72 2.79-8.22 3.1-13.5.93-4.34-3.73-8.14-7.29-11.4-10.71-3.26-3.41-5.59-5.89-6.98-7.44-1.4-1.56-3.65-4.58-6.75-9.08-3.11-4.5-5.28-7.52-6.52-9.08-17.38 18.93-34.44 30.72-51.2 35.38-10.55 3.1-23.58 4.65-39.1 4.65-23.89 0-43.52-7.37-58.88-22.11-15.36-14.74-23.04-35.6-23.04-62.6zm275.55 140.57c.62-1.24 1.55-2.49 2.8-3.73 7.75-5.27 15.2-8.84 22.34-10.7 11.79-3.1 23.27-4.81 34.44-5.12 3.1-.31 6.05-.16 8.84.46 13.97 1.24 22.35 3.57 25.14 6.98 1.24 1.87 1.86 4.66 1.86 8.38v3.26c0 10.86-2.95 23.66-8.84 38.4-5.9 14.74-14.12 26.61-24.67 35.61-1.55 1.24-2.95 1.86-4.19 1.86-.62 0-1.24-.15-1.86-.46-1.86-.93-2.33-2.64-1.4-5.13 11.48-26.99 17.22-45.76 17.22-56.31 0-3.42-.62-5.9-1.86-7.45-3.1-3.72-11.79-5.59-26.06-5.59-5.28 0-11.49.31-18.62.93-7.76.94-14.9 1.86-21.42 2.8-1.86 0-3.1-.31-3.72-.94-.62-.62-.77-1.24-.46-1.86 0-.31.15-.77.46-1.39zM.93 361.2c1.55-2.49 4.03-2.64 7.45-.47 77.57 44.99 161.98 67.49 253.21 67.49 60.81 0 120.86-11.33 180.13-33.98 1.55-.62 3.8-1.55 6.75-2.79s5.04-2.17 6.28-2.79c4.65-1.86 8.3-.93 10.94 2.79 2.64 3.72 1.78 7.14-2.56 10.24-5.59 4.03-12.73 8.69-21.41 13.96-26.69 15.83-56.48 28.09-89.37 36.77-32.89 8.69-65.01 13.04-96.35 13.04-48.41 0-94.18-8.46-137.31-25.37-43.13-16.91-81.77-40.73-115.9-71.45-1.86-1.55-2.79-3.1-2.79-4.65 0-.93.31-1.87.93-2.79zm220.16-141.97c0 12.1 3.03 21.8 9.08 29.09 6.05 7.29 14.19 10.94 24.43 10.94.93 0 2.25-.16 3.96-.47 1.71-.31 2.87-.46 3.49-.46 13.03-3.41 23.12-11.79 30.25-25.13 3.42-5.9 5.98-12.34 7.68-19.32 1.71-6.98 2.64-12.65 2.8-16.99.15-4.35.23-11.48.23-21.41v-11.64c-18 0-31.65 1.24-40.96 3.72-27.31 7.76-40.96 24.98-40.96 51.67z"/></svg>',
    description: "E-commerce and cloud computing leader",
    industry: "Technology"
  }
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
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
                    <div className="relative h-8 w-32 mx-auto grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105">
                      {(company.name === "X" || company.name === "Amazon") ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 dark:hidden">
                            {company.name === "Amazon" ? (
                              <div dangerouslySetInnerHTML={{ __html: company.logo }} />
                            ) : (
                              <Image
                                src={company.logo}
                                alt={company.name}
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            )}
                          </div>
                          <div 
                            className="w-8 h-8 hidden dark:block"
                            dangerouslySetInnerHTML={{ __html: company.darkModeLogo || '' }}
                          />
                        </div>
                      ) : (
                        <Image
                          src={company.logo}
                          alt={company.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      )}
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
        <section className="py-20 px-4 bg-primary dark:bg-black text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Call Center Training?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="gap-2 text-black dark:text-white">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="gap-2 text-black dark:text-white">
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
