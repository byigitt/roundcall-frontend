import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { 
  GraduationCap, Users, BarChart, MessageSquare, Shield, 
  Brain, Clock, Award, Zap, Database, LineChart, CheckCircle2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const featureSections = [
  {
    title: "Training Management",
    description: "Comprehensive training tools for effective learning",
    features: [
      {
        icon: <GraduationCap className="h-8 w-8" />,
        title: "Interactive Lessons",
        description: "Create and manage comprehensive training modules with rich content and video support",
      },
      {
        icon: <Brain className="h-8 w-8" />,
        title: "Smart Question Engine",
        description: "Multiple choice and text recall questions with intelligent scoring system",
      },
      {
        icon: <Clock className="h-8 w-8" />,
        title: "Training Sessions",
        description: "Timed training sessions with real-time progress tracking and instant feedback",
      },
      {
        icon: <Award className="h-8 w-8" />,
        title: "Scoring System",
        description: "Advanced scoring with time bonuses and detailed performance metrics",
      }
    ]
  },
  {
    title: "Performance Tracking",
    description: "Detailed analytics and progress monitoring",
    features: [
      {
        icon: <BarChart className="h-8 w-8" />,
        title: "Performance Analytics",
        description: "Track scores, accuracy, and response times across all training sessions",
      },
      {
        icon: <LineChart className="h-8 w-8" />,
        title: "Progress Monitoring",
        description: "Detailed insights into individual and team performance trends",
      },
      {
        icon: <Users className="h-8 w-8" />,
        title: "Leaderboards",
        description: "Global rankings and performance comparisons across teams",
      },
      {
        icon: <Zap className="h-8 w-8" />,
        title: "Real-time Feedback",
        description: "Instant performance assessment with detailed scoring breakdowns",
      }
    ]
  },
  {
    title: "Enterprise Features",
    description: "Advanced features for business needs",
    features: [
      {
        icon: <Shield className="h-8 w-8" />,
        title: "Security & Compliance",
        description: "JWT authentication, role-based access, and comprehensive error handling",
      },
      {
        icon: <Database className="h-8 w-8" />,
        title: "Data Management",
        description: "Efficient pagination, sorting, and searching across all resources",
      },
      {
        icon: <MessageSquare className="h-8 w-8" />,
        title: "API Integration",
        description: "RESTful API endpoints with detailed documentation and rate limiting",
      },
      {
        icon: <Users className="h-8 w-8" />,
        title: "User Management",
        description: "Advanced user roles, departments, and access control",
      }
    ]
  }
]

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-32 px-4 bg-gradient-to-b from-background to-muted relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070"
              alt="Enterprise training platform"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <Badge className="mb-4" variant="secondary">Features</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 p-2">
              Enterprise-Grade Training Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comprehensive tools and features designed for modern call center training needs.
            </p>
          </div>
        </section>

        {/* Training Management Section - Cards */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4" variant="secondary">Training Management</Badge>
              <h2 className="text-3xl font-bold mb-4">Comprehensive Training Tools</h2>
              <p className="text-muted-foreground">Everything you need for effective learning and development</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureSections[0].features.map((feature, index) => (
                <Card key={index} className="border bg-card hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Tracking Section - Split with Image */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="mb-4" variant="secondary">Performance Tracking</Badge>
                <h2 className="text-3xl font-bold mb-6">Advanced Analytics & Insights</h2>
                <p className="text-muted-foreground mb-8">
                  Comprehensive performance monitoring tools to track progress and drive improvement.
                </p>
                <div className="space-y-6">
                  {featureSections[1].features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-[600px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070"
                  alt="Analytics Dashboard"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Features Section - Grid with Icons */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4" variant="secondary">Enterprise Features</Badge>
              <h2 className="text-3xl font-bold mb-4">Built for Business</h2>
              <p className="text-muted-foreground">Enterprise-grade features for seamless integration and management</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {featureSections[2].features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 rounded-lg border bg-card hover:shadow-md transition-all">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4" variant="secondary">Benefits</Badge>
              <h2 className="text-3xl font-bold mb-4">Why Choose RoundCall</h2>
              <p className="text-muted-foreground">Real results that impact your business</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">Increase in agent confidence</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-primary mb-2">50%</div>
                <p className="text-muted-foreground">Reduction in training time</p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-primary mb-2">40%</div>
                <p className="text-muted-foreground">Improvement in performance</p>
              </div>
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