"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Loader2, Timer, BookOpen, CheckCircle2, XCircle, 
  BarChart3, Clock, Award, Users, Star, PlayCircle 
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import dynamic from 'next/dynamic'
import { useUserStore } from "@/lib/store/use-user-store"

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false })

interface Lesson {
  _id: string
  title: string
  description: string
  contentType: "text" | "video" | "both"
  textContent?: string
  videoUrl?: string
  duration: number
  totalEnrolled: number
  averageRating: number
}

interface Question {
  _id: string
  text: string
  type: "multipleChoice" | "textRecall" | "timedText" | "videoRecall"
  options?: string[]
  correctAnswer: number | string
  difficulty: string
  points: number
  maxAttempts: number
  videoTimestamp?: number
  displayTime?: number
}

interface Score {
  _id: string
  question: {
    _id: string
    text: string
    type: string
  }
  lesson: {
    _id: string
    title: string
  }
  answer: string
  isCorrect: boolean
  points: number
  responseTime: number
  createdAt: string
}

// Practice tipleri
type PracticeType = "speed" | "normal"

// Mock lesson data in English
const mockLesson: Lesson = {
  _id: "1",
  title: "Customer Service Fundamentals",
  description: "Learn the core principles of excellent customer service",
  contentType: "text",
  textContent: `# Customer Service Excellence

Customer service is one of the most critical success factors in the modern business world. Today, customers value not only product or service quality but also their service experience.

## Importance of Customer Service

* Building customer loyalty
* Increasing brand value
* Gaining competitive advantage
* Enhancing customer lifetime value
* Positive word-of-mouth marketing

## Core Principles

### 1. Active Listening
* Listen to customers without interruption
* Take notes and repeat key points
* Pay attention to non-verbal cues
* Show empathy and understanding

### 2. Professional Communication
* Use clear and understandable language
* Maintain a positive tone
* Avoid technical jargon
* Focus on solution-oriented communication

### 3. Quick and Effective Solutions
* Correctly diagnose the problem
* Offer realistic solutions
* Create a follow-up process
* Verify customer satisfaction

### 4. Taking Responsibility
* Acknowledge mistakes
* Take initiative
* Keep your promises
* Keep the customer informed throughout the process

## Tips for Successful Customer Service

1. Provide personalized approach to each customer
2. Stay patient and calm
3. Continuously improve yourself
4. Consider customer feedback
5. Maintain strong team communication

## Important Reminder

> "The customer's perception is your reality. Continuously strive to understand and improve their experience."

## Conclusion

Excellent customer service is a process that requires continuous learning and development. By applying the core principles and adopting a customer-focused approach, you can increase both customer satisfaction and business success.`,
  duration: 1800,
  totalEnrolled: 125,
  averageRating: 4.5
}

const mockQuestions: Question[] = [
  {
    _id: "q1",
    text: "What is the most important aspect of customer service?",
    type: "multipleChoice",
    options: [
      "Making quick sales",
      "Building long-term relationships",
      "Following scripts exactly",
      "Minimizing call duration"
    ],
    correctAnswer: 1,
    difficulty: "beginner",
    points: 10,
    maxAttempts: 2
  },
  {
    _id: "q2",
    text: "Which of the following is NOT one of the core principles mentioned in the lesson?",
    type: "multipleChoice",
    options: [
      "Listening to customers",
      "Showing empathy",
      "Avoiding responsibility",
      "Finding quick solutions"
    ],
    correctAnswer: 2,
    difficulty: "beginner",
    points: 10,
    maxAttempts: 2
  },
  {
    _id: "q3",
    text: "Explain the importance of customer satisfaction in your own words.",
    type: "textRecall",
    correctAnswer: "Customer satisfaction is fundamental for sustainable business success. Satisfied customers become loyal customers and provide recurring business.",
    difficulty: "intermediate",
    points: 15,
    maxAttempts: 3
  }
]

// Speed practice mock data
const mockSpeedLesson: Lesson = {
  _id: "speed1",
  title: "Quick Customer Service Training",
  description: "In this training, you'll watch a 1-minute video and provide quick responses. Video controls are disabled, and questions have time limits.",
  contentType: "video",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&autoplay=1&mute=0&enablejsapi=1",
  duration: 60,
  totalEnrolled: 75,
  averageRating: 4.2
}

const mockSpeedQuestions: Question[] = [
  {
    _id: "sq1",
    text: "What type of customer complaint was shown in the video?",
    type: "multipleChoice",
    options: [
      "Product quality",
      "Delivery delay",
      "Pricing",
      "Customer service"
    ],
    correctAnswer: 1,
    difficulty: "advanced",
    points: 20,
    maxAttempts: 1,
    displayTime: 15000 // 15 seconds
  },
  {
    _id: "sq2",
    text: "What solution method did the representative use?",
    type: "multipleChoice",
    options: [
      "Refund offer",
      "Discount coupon",
      "Express delivery",
      "Free product"
    ],
    correctAnswer: 2,
    difficulty: "advanced",
    points: 20,
    maxAttempts: 1,
    displayTime: 15000
  },
  {
    _id: "sq3",
    text: "How was the customer's final reaction?",
    type: "multipleChoice",
    options: [
      "Very satisfied",
      "Somewhat satisfied",
      "Neutral",
      "Not satisfied"
    ],
    correctAnswer: 0,
    difficulty: "advanced",
    points: 20,
    maxAttempts: 1,
    displayTime: 15000
  }
]

export default function PracticePage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isLoading: userLoading } = useUserStore()
  const [isPending, startTransition] = useTransition()
  const [currentStep, setCurrentStep] = useState<"lesson" | "questions">("lesson")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | string)[]>([])
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [scores, setScores] = useState<Score[]>([])
  const [performance, setPerformance] = useState<{
    totalPoints: number
    totalQuestions: number
    correctAnswers: number
    accuracy: number
    averageResponseTime: number
  } | null>(null)
  const [practiceType, setPracticeType] = useState<PracticeType>("normal")
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [isVideoComplete, setIsVideoComplete] = useState(false)
  const [videoEndTime, setVideoEndTime] = useState<number | null>(null)
  const [videoStartTime, setVideoStartTime] = useState<number | null>(null)

  useEffect(() => {
    // Redirect if not a trainee
    if (!userLoading && user && user.role.toLowerCase() !== "trainee") {
      router.replace("/dashboard")
    }
  }, [user, userLoading, router])

  // Show loading state while checking user
  if (userLoading || !user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (practiceType === "speed") {
          setCurrentLesson(mockSpeedLesson)
          setPerformance({
            totalPoints: 150,
            totalQuestions: 15,
            correctAnswers: 12,
            accuracy: 80,
            averageResponseTime: 12000
          })
          // Video başladığında zamanı kaydet
          setVideoStartTime(Date.now())
        } else {
          setCurrentLesson(mockLesson)
          setQuestions(mockQuestions)
          setPerformance({
            totalPoints: 250,
            totalQuestions: 20,
            correctAnswers: 15,
            accuracy: 75,
            averageResponseTime: 45000
          })
        }
      } catch (error) {
        toast({
          title: "Hata",
          description: "Ders verileri yüklenirken bir hata oluştu.",
          variant: "destructive"
        })
      }
    }

    fetchData()
  }, [practiceType, toast])

  useEffect(() => {
    if (videoStartTime) {
      const timer = setTimeout(() => {
        // Mock sorulardan rastgele 3 tanesini seç
        const randomQuestions = [...mockSpeedQuestions]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
        
        setQuestions(randomQuestions)
        startQuiz()
        
        toast({
          title: "Sorular hazır",
          description: "Hızlı practice başlıyor!",
        })
      }, 10000) // 10 saniye bekle

      return () => clearTimeout(timer)
    }
  }, [videoStartTime, toast])

  const startQuiz = () => {
    if (practiceType === "speed" && !videoStartTime) {
      toast({
        title: "Video başlamadı",
        description: "Lütfen videoyu başlatın.",
        variant: "destructive"
      })
      return
    }

    setCurrentStep("questions")
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setTimeLeft(questions[0]?.displayTime || 0)
  }

  const handleVideoEnd = () => {
    setIsVideoComplete(true)
    setVideoEndTime(Date.now())
  }

  const handleAnswer = (answer: number | string) => {
    startTransition(() => {
      const newAnswers = [...answers, answer]
      setAnswers(newAnswers)

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        setTimeLeft(questions[currentQuestion + 1]?.displayTime || 15000)
      } else {
        // Mock performans verilerini güncelle
        setPerformance({
          totalPoints: newAnswers.reduce((total: number, ans, index) => {
            const q = questions[index]
            return total + (ans === q.correctAnswer ? q.points : 0)
          }, 0),
          totalQuestions: questions.length,
          correctAnswers: newAnswers.filter((ans, index) => ans === questions[index].correctAnswer).length,
          accuracy: Math.round((newAnswers.filter((ans, index) => ans === questions[index].correctAnswer).length / questions.length) * 100),
          averageResponseTime: 15000
        })
        setShowResults(true)
      }
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-500"
      case "intermediate":
        return "text-yellow-500"
      case "advanced":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice</h1>
          <p className="text-muted-foreground">
            Learn and practice with interactive lessons and quizzes.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Tabs value={practiceType} onValueChange={(value) => setPracticeType(value as PracticeType)}>
            <TabsList>
              <TabsTrigger value="normal">
                <BookOpen className="mr-2 h-4 w-4" />
                Normal Practice
              </TabsTrigger>
              <TabsTrigger value="speed">
                <Timer className="mr-2 h-4 w-4" />
                Speed Practice
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Card className="bg-primary/5">
            <CardContent className="py-4 px-6 flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Total Points</div>
                <div className="text-2xl font-bold text-primary">{performance?.totalPoints || 0}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="py-4 px-6 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Accuracy</div>
                <div className="text-2xl font-bold text-primary">{performance?.accuracy || 0}%</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {currentStep === "lesson" && currentLesson && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>{currentLesson.title}</CardTitle>
                <CardDescription>{currentLesson.description}</CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  {Math.round(currentLesson.duration / 60)} min
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {practiceType === "speed" ? (
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={currentLesson.videoUrl}
                  className="w-full h-full pointer-events-none"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen={false}
                  onEnded={handleVideoEnd}
                />
              </div>
            ) : (
              <ScrollArea className="h-[600px] rounded-md border p-6">
                <article className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert prose-headings:font-heading prose-headings:leading-tight hover:prose-a:text-primary transition-colors">
                  <ReactMarkdown>{currentLesson.textContent || ""}</ReactMarkdown>
                </article>
              </ScrollArea>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{currentLesson.totalEnrolled} enrolled</span>
              <Separator orientation="vertical" className="h-4" />
              <Star className="h-4 w-4" />
              <span>{currentLesson.averageRating.toFixed(1)} rating</span>
            </div>
            <Button 
              onClick={startQuiz} 
              className="gap-2"
              disabled={practiceType === "speed" && !isVideoComplete}
            >
              <PlayCircle className="h-4 w-4" />
              Start Practice
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === "questions" && !showResults && questions[currentQuestion] && (
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <Progress value={(currentQuestion / questions.length) * 100} />
              <div className="flex items-center justify-between">
                <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
                {questions[currentQuestion].type === "timedText" && (
                  <div className="flex items-center text-muted-foreground">
                    <Timer className="mr-2 h-4 w-4" />
                    <span className="text-sm">Time remaining: {Math.ceil(timeLeft / 1000).toString()}s</span>
                  </div>
                )}
              </div>
              <Badge variant="outline" className={cn(getDifficultyColor(questions[currentQuestion].difficulty))}>
                {questions[currentQuestion].difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg font-medium">
              {questions[currentQuestion].text}
            </div>
            {questions[currentQuestion].type === "multipleChoice" && (
              <div className="grid gap-2">
                {questions[currentQuestion].options?.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-4 px-6"
                    onClick={() => handleAnswer(index)}
                    disabled={isPending}
                  >
                    <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            )}
            {(questions[currentQuestion].type === "textRecall" || questions[currentQuestion].type === "timedText") && (
              <div className="space-y-2">
                <textarea
                  className="w-full min-h-[100px] p-2 rounded-md border"
                  placeholder="Type your answer here..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleAnswer(e.currentTarget.value)
                    }
                  }}
                />
                <Button 
                  onClick={() => {
                    const textarea = document.querySelector("textarea")
                    if (textarea) handleAnswer(textarea.value)
                  }}
                  disabled={isPending}
                >
                  Submit Answer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Practice Results</CardTitle>
            <CardDescription>
              Here's how you performed on this practice session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {answers.filter((_, index) => {
                      const q = questions[index]
                      return answers[index] === q.correctAnswer
                    }).length}
                    /{questions.length}
                  </div>
                  <CardDescription>Correct Answers</CardDescription>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.round((answers.filter((_, index) => {
                      const q = questions[index]
                      return answers[index] === q.correctAnswer
                    }).length / questions.length) * 100)}%
                  </div>
                  <CardDescription>Accuracy</CardDescription>
                </CardContent>
              </Card>
              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {answers.reduce((total: number, _, index) => {
                      const q = questions[index]
                      return total + (answers[index] === q.correctAnswer ? q.points : 0)
                    }, 0)}
                  </div>
                  <CardDescription>Total Points</CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <div className="font-medium">{question.text}</div>
                      <div className="text-sm text-muted-foreground">
                        Points: {answers[index] === question.correctAnswer ? question.points : 0}/{question.points}
                      </div>
                    </div>
                    {answers[index] === question.correctAnswer ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Correct
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-4 w-4 mr-1" />
                        Incorrect
                      </Badge>
                    )}
                  </div>
                  {question.type === "multipleChoice" && (
                    <div className="space-y-2 mt-4">
                      {question.options?.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={cn(
                            "p-3 rounded-md",
                            optionIndex === question.correctAnswer
                              ? "bg-green-500/10 text-green-500"
                              : optionIndex === answers[index]
                              ? "bg-red-500/10 text-red-500"
                              : "bg-muted"
                          )}
                        >
                          <span className="mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                  {(question.type === "textRecall" || question.type === "timedText") && (
                    <div className="space-y-2 mt-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Your Answer:</div>
                        <div className="p-3 rounded-md bg-muted">
                          {answers[index] as string}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Correct Answer:</div>
                        <div className="p-3 rounded-md bg-green-500/10 text-green-500">
                          {question.correctAnswer as string}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setCurrentStep("lesson")} className="w-full gap-2">
              <BookOpen className="h-4 w-4" />
              Return to Lesson
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
} 