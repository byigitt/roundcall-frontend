"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { MessageSquare, Play, Users2, ArrowLeft } from "lucide-react"

interface Scenario {
  id: number;
  title: string;
  description: string;
  category: string;
  messages: {
    role: "customer" | "agent";
    content: string;
  }[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Fiber Internet Application",
    description: "Customer wants to get fiber internet service. Agent professionally explains pricing, speed, and campaign details.",
    category: "Sales",
    messages: [
      {
        role: "customer",
        content: "Hello, I'd like to get information about your fiber internet service."
      },
      {
        role: "agent",
        content: "Hello! I'd be happy to help you with our fiber internet service. Would you like me to check if fiber infrastructure is available at your address first?"
      },
      {
        role: "customer",
        content: "Yes, please. My address is: Downtown, 123 Main Street..."
      },
      {
        role: "agent",
        content: "I can confirm that fiber infrastructure is available at your address. Here are our available packages: 100Mbps - $49.99, 200Mbps - $59.99, and 500Mbps - $79.99. All packages include unlimited usage and a free modem."
      },
      {
        role: "customer",
        content: "The 200Mbps package interests me. What's the contract duration?"
      },
      {
        role: "agent",
        content: "The 200Mbps package is $59.99 with a 24-month contract. The price is locked during the contract period. Installation is free, and we can set it up within 24 hours. Would you like to proceed with the application?"
      },
      {
        role: "customer",
        content: "Yes, I'd like to proceed. What documents do I need?"
      },
      {
        role: "agent",
        content: "Great choice! For the application, we'll need: 1) A valid ID, 2) Proof of address (utility bill or lease agreement), and 3) A contact phone number. We also require a credit check. Would you like to proceed with these requirements?"
      },
      {
        role: "customer",
        content: "That sounds reasonable. I have all those documents. How long will the application process take?"
      },
      {
        role: "agent",
        content: "The application process typically takes about 15-20 minutes. Once approved, we can schedule the installation within 24 hours. We also offer a 30-day satisfaction guarantee. If you're not completely satisfied, you can cancel without any early termination fees during this period. Shall we start the application now?"
      },
      {
        role: "customer",
        content: "Yes, let's proceed with the application."
      },
      {
        role: "agent",
        content: "Excellent! I'll guide you through the process step by step. First, could you please provide your full name and contact number?"
      }
    ]
  },
  {
    id: 2,
    title: "Internet Speed Issue",
    description: "Customer is unhappy with internet speed. Agent diagnoses the problem and offers a temporary solution.",
    category: "Technical Support",
    messages: [
      {
        role: "customer",
        content: "Good day, my internet has been very slow for the past few days. I usually get 100Mbps, but now I'm not even getting 10Mbps."
      },
      {
        role: "agent",
        content: "Good day. I apologize for the inconvenience. Let me check and help you right away. When was the last time you restarted your modem?"
      },
      {
        role: "customer",
        content: "I tried this morning, but nothing changed."
      },
      {
        role: "agent",
        content: "I understand. I've checked your line and I can see there's ongoing infrastructure maintenance in your area. This is causing temporary speed reduction. The work is scheduled to be completed today by 6 PM."
      },
      {
        role: "customer",
        content: "So, will I not be able to use the internet during this time?"
      },
      {
        role: "agent",
        content: "Your internet service is still active, but speeds might be lower. I can provide you with 5GB of mobile data for free during this period to ensure your work isn't disrupted. Would you like me to do that?"
      },
      {
        role: "customer",
        content: "Yes, that would be helpful. But what if the problem continues after 6 PM?"
      },
      {
        role: "agent",
        content: "If you experience any issues after the maintenance is completed, please contact us immediately. I'll create a follow-up ticket now, and our system will automatically check your connection speed after 6 PM. If it's not back to normal, a technician will be dispatched to your location first thing tomorrow morning. Would you like me to set that up?"
      },
      {
        role: "customer",
        content: "Yes, please. I work from home, so I really need reliable internet."
      },
      {
        role: "agent",
        content: "I completely understand. I've created the follow-up ticket (#12345) and scheduled an automatic speed test for 6:30 PM. I'm also adding a note about your work-from-home situation to prioritize any necessary technical support. The mobile data has been activated on your account. You should receive an SMS with instructions in the next 5 minutes. Is there anything else you need assistance with?"
      },
      {
        role: "customer",
        content: "No, that covers everything. Thank you for your help."
      },
      {
        role: "agent",
        content: "You're welcome! Just to confirm: you have 5GB of free mobile data, a follow-up speed test scheduled for 6:30 PM, and priority technical support if needed. Please don't hesitate to contact us if you need any further assistance. Have a great day!"
      }
    ]
  },
  {
    id: 3,
    title: "Bill Dispute",
    description: "Customer disputes a high bill. Agent explains the situation and offers a solution.",
    category: "Billing",
    messages: [
      {
        role: "customer",
        content: "My bill is much higher than usual this month. I normally pay $60, but this month it's $100. Can I learn why?"
      },
      {
        role: "agent",
        content: "I'll help you with that. Let me check your bill details first. Could you please provide your account number?"
      },
      {
        role: "customer",
        content: "Yes, it's 12345678901"
      },
      {
        role: "agent",
        content: "I've reviewed your bill. Your contract period ended last month, and your plan switched to standard rates. That's why there's an increase. I can offer you new promotional plans."
      },
      {
        role: "customer",
        content: "Why wasn't I informed beforehand? Shouldn't I have been notified about this?"
      },
      {
        role: "agent",
        content: "We sent notifications via SMS and email one month before your contract ended. However, I'd like to help you right away. We have a new promotion at $65 monthly that suits your usage pattern. With a 24-month contract, I can also offer a $20 discount on this month's bill. Would you like to consider this offer?"
      }
    ]
  },
  {
    id: 4,
    title: "Service Cancellation Request",
    description: "Customer wants to cancel service. Agent attempts to retain the customer.",
    category: "Cancellation",
    messages: [
      {
        role: "customer",
        content: "Good day, I want to cancel my internet service."
      },
      {
        role: "agent",
        content: "Good day. Could I first understand the reason for your cancellation request? Perhaps we can find a more suitable solution for you."
      },
      {
        role: "customer",
        content: "The prices are too high, and my internet keeps disconnecting."
      },
      {
        role: "agent",
        content: "I understand. Let's address the technical issue first. Then I can offer you a special 30% discounted rate. Our technical team can visit your address within 24 hours to resolve the connection issues."
      },
      {
        role: "customer",
        content: "Why didn't you offer this discount before?"
      },
      {
        role: "agent",
        content: "This is a special retention offer available to our long-term customers. Since you've been with us for 2 years, you qualify for this promotion. I can also add an extra 10% discount for the next 3 months."
      }
    ]
  },
  {
    id: 5,
    title: "Modem Malfunction",
    description: "Customer's modem is malfunctioning. Agent attempts remote troubleshooting, then arranges service if needed.",
    category: "Technical Support",
    messages: [
      {
        role: "customer",
        content: "Hello, my modem lights are flashing and the internet isn't working."
      },
      {
        role: "agent",
        content: "Hello. I'll help you right away. First, could you please turn off your modem, wait for 10 seconds, and then turn it back on?"
      },
      {
        role: "customer",
        content: "Okay, trying that... No, it's still flashing the same way."
      },
      {
        role: "agent",
        content: "Alright, now could you press and hold the reset button on the back of the modem for 10 seconds? This will restore factory settings."
      },
      {
        role: "customer",
        content: "I tried that but nothing changed. The same issue persists."
      },
      {
        role: "agent",
        content: "I understand, this might indicate a hardware issue with the modem. I'll create a service ticket for a free modem replacement right away. Our technician can visit your address tomorrow between 9 AM and 6 PM. Would that work for you?"
      }
    ]
  },
  {
    id: 6,
    title: "Package Upgrade Discussion",
    description: "Customer inquires about upgrading their current package. Agent explains benefits and handles price negotiations.",
    category: "Sales",
    messages: [
      {
        role: "customer",
        content: "Hi, I'm interested in upgrading my current internet package. I currently have the 100Mbps plan."
      },
      {
        role: "agent",
        content: "Hello! Thank you for considering an upgrade. I'd be happy to help you find the best package for your needs. Could you tell me a bit about how you typically use your internet? For example, do you work from home, stream videos, or play online games?"
      },
      {
        role: "customer",
        content: "Well, I recently started working from home, and my kids are doing online classes. We also stream a lot of movies in the evening. Sometimes the internet feels slow when we're all online."
      },
      {
        role: "agent",
        content: "I understand completely. With multiple users streaming and video conferencing, a higher speed package would definitely improve your experience. Based on your usage, I'd recommend our 300Mbps package. It would provide smoother streaming and faster downloads, especially when multiple devices are connected."
      },
      {
        role: "customer",
        content: "What would be the cost difference? I'm paying $49.99 now."
      },
      {
        role: "agent",
        content: "The 300Mbps package is normally $79.99, but we currently have a special promotion. If you upgrade today, you can get it for $64.99 per month, locked in for 24 months. This includes our premium Wi-Fi router that better handles multiple devices."
      },
      {
        role: "customer",
        content: "That's still quite a jump from what I'm paying now. Is there any way to get it a bit cheaper?"
      },
      {
        role: "agent",
        content: "I understand your concern about the price. Since you've been a loyal customer, I can add our loyalty discount of $5 per month. I can also include our streaming TV package, which normally costs $15/month, for free for the first 6 months. Would that help make the upgrade more attractive?"
      },
      {
        role: "customer",
        content: "The streaming package sounds interesting. What channels does it include?"
      },
      {
        role: "agent",
        content: "Our streaming package includes over 100 channels, including popular networks like HBO, ESPN, and Disney+. You can watch on up to 3 devices simultaneously, and it comes with a cloud DVR feature to record your favorite shows. Would you like me to list some of the key channels?"
      },
      {
        role: "customer",
        content: "Yes, please. And does it work on smart TVs?"
      },
      {
        role: "agent",
        content: "Yes, it works on all major smart TVs, phones, tablets, and web browsers. You'll get channels like HBO, ESPN, Disney+, National Geographic, CNN, and many more. We also have special channels for kids' educational content, which could be perfect for your children's online classes. The app is very user-friendly, and we provide full technical support for setup."
      },
      {
        role: "customer",
        content: "That does sound good. So it would be $59.99 for the 300Mbps internet with the streaming package free for 6 months?"
      },
      {
        role: "agent",
        content: "Exactly! To summarize the offer: You'll get the 300Mbps internet for $59.99 (after the $5 loyalty discount), plus the streaming package free for 6 months (normally $15/month). After 6 months, you can either keep or remove the streaming package. The internet price is locked in for 24 months. Would you like to proceed with this upgrade?"
      },
      {
        role: "customer",
        content: "Yes, let's do it. When can the upgrade be activated?"
      },
      {
        role: "agent",
        content: "Excellent choice! I can schedule the upgrade for today, and it will be active within the next 2 hours. I'll also send you an email with instructions for setting up the streaming service. Would you like me to walk you through the streaming setup once the upgrade is complete?"
      }
    ]
  },
  {
    id: 7,
    title: "Service Outage Complaint",
    description: "Customer reports complete service outage. Agent handles the crisis and provides compensation.",
    category: "Technical Support",
    messages: [
      {
        role: "customer",
        content: "My internet and TV have been completely down for the past 3 hours. This is unacceptable - I'm working from home and have an important meeting in 30 minutes!"
      },
      {
        role: "agent",
        content: "I sincerely apologize for this disruption, especially given your work situation. Let me check the status of your area immediately. Could you please confirm your address while I look this up?"
      },
      {
        role: "customer",
        content: "It's 456 Park Avenue, Apartment 7B. I've already tried rebooting everything multiple times, so please don't ask me to do that again."
      },
      {
        role: "agent",
        content: "Thank you for confirming your address. I can see there's a major fiber optic cable damage in your area due to ongoing construction work. Our emergency repair team is already on site. The estimated resolution time is 2 hours. I understand this is critical given your upcoming meeting - let me see what immediate solutions I can offer."
      },
      {
        role: "customer",
        content: "2 hours? This is going to cost me a day's work! I need an immediate solution for my meeting."
      },
      {
        role: "agent",
        content: "I completely understand the urgency. I can immediately activate an unlimited mobile hotspot on your account, which you can use for your meeting. This will be free of charge. Would you like me to set this up right now? It takes just 2 minutes to activate."
      },
      {
        role: "customer",
        content: "Yes, please do that. But I still want to discuss compensation for this outage."
      },
      {
        role: "agent",
        content: "Of course. Let me activate the hotspot first. I'm doing that now... Could you please check your phone for a text message with the activation details? While you check that, I'll prepare a compensation package for the inconvenience."
      },
      {
        role: "customer",
        content: "Yes, I got the text. Now, about the compensation?"
      },
      {
        role: "agent",
        content: "Given the impact on your work, I'm applying the following compensation: 1) A full week's credit on your monthly bill, 2) The mobile hotspot service free for the next 30 days as backup, and 3) Priority status for your service for the next 3 months, which means any future issues will be handled with highest priority. Does this seem fair?"
      },
      {
        role: "customer",
        content: "The credit and priority status are good, but only 30 days of hotspot? Given that this has happened twice this month, I think I need more assurance."
      },
      {
        role: "agent",
        content: "I apologize for the repeated issues. You're absolutely right. I'll extend the mobile hotspot service to 90 days, and I'm also adding our premium technical support package free for 6 months ($10/month value). This includes 24/7 priority support and quarterly preventive maintenance checks. Would this better address your concerns?"
      },
      {
        role: "customer",
        content: "Yes, that's better. How can I monitor the status of the repair?"
      },
      {
        role: "agent",
        content: "I'll send you real-time updates via text message. You can also track the repair status on our app or website - I've just sent you a link. I'll personally monitor this issue and call you as soon as service is restored. Would you like me to also help test your connection once it's back up?"
      }
    ]
  },
  {
    id: 8,
    title: "Multiple Service Bundle",
    description: "Customer inquires about bundling multiple services. Agent creates a customized package with special discounts.",
    category: "Sales",
    messages: [
      {
        role: "customer",
        content: "I'm moving to a new house next month and interested in bundling internet, TV, and home security. What packages do you offer?"
      },
      {
        role: "agent",
        content: "Congratulations on your new home! I'd be happy to help you create a perfect bundle. To ensure I recommend the best package, could you tell me about your household? How many people will be using these services?"
      },
      {
        role: "customer",
        content: "It's me, my wife, and two teenagers. We all use a lot of internet, watch different shows, and security is important as we travel occasionally."
      },
      {
        role: "agent",
        content: "Thank you for that information. Based on your family's needs, I'd recommend our Premium Bundle: 500Mbps internet, Advanced TV package with 4 room setup, and our Smart Security system. Would you like me to break down the features of each service?"
      },
      {
        role: "customer",
        content: "Yes, please. And I need to know about the costs too."
      },
      {
        role: "agent",
        content: "Let me break it down: 1) 500Mbps internet ($89.99/mo) perfect for multiple devices and heavy streaming, 2) Advanced TV ($79.99/mo) with 200+ channels, Netflix integration, and 4 room setup, 3) Smart Security ($49.99/mo) with 24/7 monitoring, cameras, and smartphone control. However, with our bundle discount, instead of $219.97, you'd pay $169.99/month."
      },
      {
        role: "customer",
        content: "That's still quite expensive. Are there any other discounts available? And what equipment is included?"
      },
      {
        role: "agent",
        content: "I understand. Since you're a new customer bundling three services, I can apply our new home discount of $20/month for the first year. Regarding equipment, you'll receive: 1) Advanced Wi-Fi 6 router, 2) 4 TV boxes with voice remote, 3) Security system with 2 cameras, motion sensors, and smart doorbell. Installation ($199 value) would be free. Would you like details about any specific equipment?"
      },
      {
        role: "customer",
        content: "Tell me more about the security system. Can I add more cameras? And how does the monitoring work?"
      },
      {
        role: "agent",
        content: "The security system is fully expandable. Additional cameras are $5/month each or $99 to purchase. The base system includes 24/7 professional monitoring with direct police/fire dispatch, mobile alerts, and live camera viewing through our app. You can also integrate smart locks and thermostats. Would you like me to include additional cameras in your package?"
      },
      {
        role: "customer",
        content: "Yes, I think I'd need two more cameras for the backyard. What's the total cost now?"
      },
      {
        role: "agent",
        content: "With two additional cameras at $5 each, your total would be $179.99/month for the first year (including the new home discount). After that, it would be $199.99/month. All prices are guaranteed for 24 months with our contract. The security system also includes free maintenance and battery replacement. Should we proceed with scheduling the installation?"
      },
      {
        role: "customer",
        content: "What about the installation timeline? We're moving in on the 15th."
      },
      {
        role: "agent",
        content: "We can schedule the installation for your move-in day or any day after. Our technicians will install all services in one visit, typically taking 4-5 hours. They'll also help set up your Wi-Fi network, TV boxes, and security system app. Would you like to schedule the installation for the 15th? We have morning and afternoon slots available."
      },
      {
        role: "customer",
        content: "Morning would be better. What time can they come?"
      },
      {
        role: "agent",
        content: "I can schedule them for 8 AM on the 15th. The technician will call you 30 minutes before arrival. They'll set up everything and won't leave until you're comfortable using all services. I'll also add a note for them to provide in-person tutorials for the security system and TV features. Would you like to proceed with this installation time?"
      }
    ]
  },
  {
    id: 9,
    title: "Service Quality Complaint",
    description: "Customer complains about ongoing service quality issues. Agent provides resolution and preventive measures.",
    category: "Technical Support",
    messages: [
      {
        role: "customer",
        content: "I've been having issues with my TV service for weeks now. Channels keep freezing, picture quality is poor, and sometimes the box just reboots itself. I've called three times already!"
      },
      {
        role: "agent",
        content: "I sincerely apologize for your ongoing issues and multiple calls. I can see from your history that this has been frustrating. Let me access your previous case notes and TV box diagnostics to get a complete picture. May I put you on a brief hold while I review this thoroughly?"
      },
      {
        role: "customer",
        content: "Fine, but please make this the last time I need to call about this."
      },
      {
        role: "agent",
        content: "Thank you for your patience. I've reviewed everything, including the remote diagnostics from your TV box. I can see that there are signal quality fluctuations reaching your home. This explains the freezing and quality issues. I'm going to take comprehensive steps to resolve this permanently."
      },
      {
        role: "customer",
        content: "What does that mean exactly? The last agent said they fixed it too."
      },
      {
        role: "agent",
        content: "I understand your skepticism. Here's my action plan: 1) I'm scheduling a senior technician visit to check your entire cable line from the street to your TV, 2) We'll replace your TV box with our latest model, 3) I'll add a signal amplifier free of charge. Would you like me to explain how each of these steps will help?"
      },
      {
        role: "customer",
        content: "Yes, please explain. And when can this be done?"
      },
      {
        role: "agent",
        content: "The signal amplifier will stabilize your connection, preventing the freezing. The new TV box has better processing power and updated software to handle any signal fluctuations. The senior technician will ensure all connections are optimal and replace any degraded cables. I can schedule this for tomorrow morning. Would 9 AM work for you?"
      },
      {
        role: "customer",
        content: "Tomorrow morning is fine. But what about compensation for all these issues?"
      },
      {
        role: "agent",
        content: "Absolutely right. I'm applying a credit for one month of TV service ($79.99) to your account. I'm also adding our Premium TV package upgrade ($20/month value) free for 3 months. This includes additional HD channels and premium sports content. Would you like me to explain the new channels you'll receive?"
      },
      {
        role: "customer",
        content: "What guarantee do I have that this will actually fix the problem this time?"
      },
      {
        role: "agent",
        content: "I understand your concern. I'm adding a 90-day service guarantee to your account. If you experience any similar issues within 90 days, you'll receive automatic credits and priority support. I'm also scheduling automated weekly diagnostic checks on your TV box. Would you like me to set up text notifications for these diagnostic results?"
      },
      {
        role: "customer",
        content: "Yes, set up the notifications. What time exactly will the technician arrive tomorrow?"
      },
      {
        role: "agent",
        content: "The technician will arrive between 9-10 AM. You'll receive a text when they're on their way. I've noted in the work order that this is a priority service call requiring a senior technician. I'll also personally follow up with you tomorrow afternoon to ensure everything is working perfectly. Would you like me to send you an email confirmation with all these details?"
      },
      {
        role: "customer",
        content: "Yes, send the email. And what's your direct number in case I need to follow up?"
      },
      {
        role: "agent",
        content: "I'm sending you the email now with my direct extension (ext. 7234). I've also added a note to your account to route any calls directly to our senior support team for the next 90 days. The email will include the technician's details, your service credits, and the guarantee terms. Is there anything else you need clarification on?"
      }
    ]
  }
]

export default function ScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)

  const uniqueCategories = [...new Set(scenarios.map(s => s.category))]
  const messagesCount = scenarios.reduce((acc, s) => acc + s.messages.length, 0)

  return (
    <div className="space-y-6">
      {!selectedScenario ? (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Training Scenarios</h1>
            <p className="text-muted-foreground">
              Practice with real-world customer service scenarios
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Scenarios
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scenarios.length}</div>
                <p className="text-xs text-muted-foreground">
                  {uniqueCategories.length} different categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Interactions
                </CardTitle>
                <Users2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{messagesCount}</div>
                <p className="text-xs text-muted-foreground">
                  Customer-agent dialogues
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Scenarios Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{scenario.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {scenario.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{scenario.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {scenario.messages.length} message exchanges
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => setSelectedScenario(scenario)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Practice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedScenario(null)}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Scenarios
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">{selectedScenario.title}</h1>
              <p className="text-muted-foreground mt-2">
                {selectedScenario.description}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg py-1 px-4">
              {selectedScenario.category}
            </Badge>
          </div>

          <Card>
            <CardContent className="p-6">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {selectedScenario.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "customer" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "customer"
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="text-xs mb-1 opacity-70">
                          {message.role === "customer" ? "Customer" : "Agent"}
                        </div>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 