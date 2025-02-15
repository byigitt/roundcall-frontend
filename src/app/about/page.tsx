import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Building2, Users, Target, Trophy } from "lucide-react"
import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const stats = [
  {
    icon: <Building2 className="h-6 w-6 text-primary" />,
    value: "2018",
    label: "Founded",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    value: "50+",
    label: "Team Members",
  },
  {
    icon: <Target className="h-6 w-6 text-primary" />,
    value: "200+",
    label: "Enterprise Clients",
  },
  {
    icon: <Trophy className="h-6 w-6 text-primary" />,
    value: "15+",
    label: "Industry Awards",
  },
]

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070",
    bio: "20+ years of experience in call center operations and training",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
    bio: "Expert in AI and machine learning applications for training",
  },
  {
    name: "Emma Williams",
    role: "Head of Training",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070",
    bio: "Specialized in developing effective training methodologies",
  },
]

const values = [
  {
    title: "Innovation",
    description: "Continuously pushing the boundaries of training technology",
  },
  {
    title: "Excellence",
    description: "Committed to delivering the highest quality solutions",
  },
  {
    title: "Customer Focus",
    description: "Putting our customers' success at the heart of everything",
  },
  {
    title: "Collaboration",
    description: "Working together to achieve exceptional results",
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-32 px-4 bg-gradient-to-b from-background to-muted relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
              alt="Team collaboration"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <Badge className="mb-4" variant="secondary">About Us</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 p-2">
              Transforming Call Center Training
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're on a mission to revolutionize how call centers train and develop their teams through innovative technology.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="p-0">
                    <div className="flex justify-center mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <CardDescription>{stat.label}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4" variant="secondary">Our Values</Badge>
              <h2 className="text-3xl font-bold mb-4">
                What Drives Us Forward
              </h2>
              <p className="text-muted-foreground">
                Our core values shape everything we do and how we serve our customers.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4" variant="secondary">Our Team</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Meet Our Leadership
              </h2>
              <p className="text-muted-foreground">
                Experienced professionals dedicated to transforming call center training.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <div className="text-primary mb-2">{member.role}</div>
                    <CardDescription>{member.bio}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-16">
              <Badge className="mb-4" variant="secondary">FAQ</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Common Questions About RoundCall
              </h2>
              <p className="text-muted-foreground">
                Learn more about our company and mission
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What makes RoundCall different from other training platforms?</AccordionTrigger>
                <AccordionContent>
                  RoundCall stands out through our AI-powered training simulations, real-time feedback system, and comprehensive analytics. Our platform is specifically designed for call centers, unlike general training solutions, and incorporates industry best practices developed through years of experience.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How did RoundCall start?</AccordionTrigger>
                <AccordionContent>
                  RoundCall was founded in 2018 by Sarah Johnson, who spent 20 years managing call centers and recognized the need for better training solutions. What started as a small team of industry experts has grown into a global company serving over 200 enterprises worldwide.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What industries do you serve?</AccordionTrigger>
                <AccordionContent>
                  While our platform is designed for all call centers, we have particular expertise in technology, financial services, healthcare, retail, and telecommunications. Our customizable platform can be adapted to meet the specific needs of any industry.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How large is the RoundCall team?</AccordionTrigger>
                <AccordionContent>
                  We have over 50 team members globally, including training experts, developers, AI specialists, and customer success managers. Our team is distributed across offices in New York, London, and Singapore, allowing us to provide 24/7 support to our clients.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>What certifications and compliance standards do you maintain?</AccordionTrigger>
                <AccordionContent>
                  RoundCall maintains ISO 27001 certification for information security, is GDPR compliant, and follows SOC 2 Type II standards. We regularly undergo third-party security audits and maintain compliance with industry-specific regulations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Do you offer career opportunities?</AccordionTrigger>
                <AccordionContent>
                  Yes, we're always looking for talented individuals to join our team! We offer positions in development, AI/ML, customer success, sales, and training. Visit our careers page to see current openings and learn about our company culture.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>How do you contribute to the community?</AccordionTrigger>
                <AccordionContent>
                  We're committed to giving back through our RoundCall Cares program, which includes providing free training licenses to non-profits, supporting educational initiatives, and organizing volunteer programs. We also contribute to open-source projects and share industry knowledge through our blog and webinars.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>What's next for RoundCall?</AccordionTrigger>
                <AccordionContent>
                  We're continuously innovating with new features like advanced AI simulations, expanded language support, and enhanced analytics capabilities. Our roadmap includes deeper integration options, mobile training solutions, and expanded global presence to better serve our customers worldwide.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 bg-primary dark:bg-black text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Our Mission
            </h2>
            <p className="text-lg mb-8 text-white/90">
              To empower call centers with innovative training solutions that enhance customer service quality and agent satisfaction.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 