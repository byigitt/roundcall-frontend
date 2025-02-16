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

// Geçici örnek veri
const mockLesson: Lesson = {
  _id: "1",
  title: "Müşteri Hizmetleri Temelleri",
  description: "Mükemmel müşteri hizmetinin temel prensiplerini öğrenin",
  contentType: "text",
  textContent: `# Müşteri Hizmetleri Mükemmelliği

Müşteri hizmetleri, modern iş dünyasının en kritik başarı faktörlerinden biridir. Günümüzde müşteriler sadece ürün veya hizmet kalitesine değil, aynı zamanda aldıkları hizmet deneyimine de büyük önem vermektedir.

## Müşteri Hizmetlerinin Önemi

* Müşteri sadakati oluşturma
* Marka değerini artırma
* Rekabet avantajı sağlama
* Müşteri yaşam boyu değerini yükseltme
* Olumlu ağızdan ağıza pazarlama

## Temel Prensipler

### 1. Aktif Dinleme
* Müşteriyi sözünü kesmeden dinleyin
* Not alın ve önemli noktaları tekrarlayın
* Sözel olmayan ipuçlarına dikkat edin
* Empati kurun ve anlayış gösterin

### 2. Profesyonel İletişim
* Net ve anlaşılır bir dil kullanın
* Pozitif bir ton benimseyin
* Teknik jargondan kaçının
* Çözüm odaklı iletişim kurun

### 3. Hızlı ve Etkili Çözüm
* Problemi doğru teşhis edin
* Gerçekçi çözümler sunun
* Takip süreci oluşturun
* Müşteri memnuniyetini doğrulayın

### 4. Sorumluluk Alma
* Hataları kabul edin
* İnisiyatif kullanın
* Sözlerinizi tutun
* Süreç boyunca müşteriyi bilgilendirin

## Başarılı Müşteri Hizmetleri İçin İpuçları

1. Her müşteriye özel yaklaşım gösterin
2. Sabırlı ve sakin kalın
3. Sürekli kendinizi geliştirin
4. Müşteri geri bildirimlerini dikkate alın
5. Ekip içi iletişimi güçlü tutun

## Önemli Hatırlatma

> "Müşterinin algısı sizin gerçekliğinizdir. Onların deneyimini anlamak ve iyileştirmek için sürekli çaba gösterin."

## Sonuç

Mükemmel müşteri hizmeti, sürekli öğrenme ve gelişme gerektiren bir süreçtir. Temel prensipleri uygulayarak ve müşteri odaklı bir yaklaşım benimseyerek, hem müşteri memnuniyetini hem de işletme başarısını artırabilirsiniz.`,
  duration: 1800,
  totalEnrolled: 125,
  averageRating: 4.5
}

const mockQuestions: Question[] = [
  {
    _id: "q1",
    text: "Müşteri hizmetlerinin en önemli yönü nedir?",
    type: "multipleChoice",
    options: [
      "Hızlı satış yapmak",
      "Uzun vadeli ilişkiler kurmak",
      "Senaryolara tam uymak",
      "Çağrı süresini minimize etmek"
    ],
    correctAnswer: 1,
    difficulty: "beginner",
    points: 10,
    maxAttempts: 2
  },
  {
    _id: "q2",
    text: "Aşağıdakilerden hangisi derste bahsedilen temel prensiplerden biri DEĞİLDİR?",
    type: "multipleChoice",
    options: [
      "Müşterileri dinlemek",
      "Empati göstermek",
      "Sorumluluktan kaçınmak",
      "Hızlı çözümler bulmak"
    ],
    correctAnswer: 2,
    difficulty: "beginner",
    points: 10,
    maxAttempts: 2
  },
  {
    _id: "q3",
    text: "Müşteri memnuniyetinin önemini kendi cümlelerinizle açıklayın.",
    type: "textRecall",
    correctAnswer: "Müşteri memnuniyeti, işletmenin sürdürülebilir başarısı için temel faktördür. Memnun müşteriler sadık müşterilere dönüşür ve tekrar eden iş sağlar.",
    difficulty: "intermediate",
    points: 15,
    maxAttempts: 3
  }
]

// Hızlı practice için örnek veri
const mockSpeedLesson: Lesson = {
  _id: "speed1",
  title: "Hızlı Müşteri Hizmetleri Eğitimi",
  description: "Bu eğitimde 1 dakikalık videoyu izleyip hızlı yanıtlar vermeniz gerekecek. Video kontrolü yapılamaz ve sorular için süre sınırı vardır.",
  contentType: "video",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&autoplay=1&mute=0&enablejsapi=1",
  duration: 60,
  totalEnrolled: 75,
  averageRating: 4.2
}

const mockSpeedQuestions: Question[] = [
  {
    _id: "sq1",
    text: "Videoda gösterilen müşteri şikayeti türü nedir?",
    type: "multipleChoice",
    options: [
      "Ürün kalitesi",
      "Teslimat gecikmesi",
      "Fiyatlandırma",
      "Müşteri hizmetleri"
    ],
    correctAnswer: 1,
    difficulty: "advanced",
    points: 20,
    maxAttempts: 1,
    displayTime: 15000 // 15 saniye
  },
  {
    _id: "sq2",
    text: "Temsilcinin kullandığı çözüm yöntemi nedir?",
    type: "multipleChoice",
    options: [
      "İade teklifi",
      "İndirim kuponu",
      "Hızlı teslimat",
      "Ücretsiz ürün"
    ],
    correctAnswer: 2,
    difficulty: "advanced",
    points: 20,
    maxAttempts: 1,
    displayTime: 15000
  },
  {
    _id: "sq3",
    text: "Müşterinin son tepkisi nasıldı?",
    type: "multipleChoice",
    options: [
      "Çok memnun",
      "Kısmen memnun",
      "Nötr",
      "Memnun değil"
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
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <ReactMarkdown>{currentLesson.textContent || ""}</ReactMarkdown>
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