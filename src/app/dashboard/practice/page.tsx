"use client"

import { useState, useTransition } from "react"
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
import { Loader2, Timer } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Temporary mock data
const mockLesson = {
  id: "1",
  title: "Customer Service Basics",
  content: `# Introduction to Customer Service

Good customer service is the lifeblood of any business. You can offer promotions and slash prices to bring in as many new customers as you want, but unless you can get some of those customers to come back, your business won't be profitable for long.

## Key Principles

1. Listen to your customers
2. Show empathy
3. Communicate clearly
4. Take responsibility
5. Find solutions quickly

Remember: The customer's perception is your reality.`,
  questions: [
    {
      id: "q1",
      text: "What is the most important aspect of customer service?",
      options: [
        "Making quick sales",
        "Building long-term relationships",
        "Following scripts exactly",
        "Minimizing call time"
      ],
      correctAnswer: 1
    },
    {
      id: "q2",
      text: "Which of these is NOT a key principle mentioned in the lesson?",
      options: [
        "Listening to customers",
        "Showing empathy",
        "Avoiding responsibility",
        "Finding solutions quickly"
      ],
      correctAnswer: 2
    }
  ]
}

export default function PracticePage() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [currentStep, setCurrentStep] = useState<"lesson" | "questions">("lesson")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const startQuiz = () => {
    setCurrentStep("questions")
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
  }

  const handleAnswer = (answerIndex: number) => {
    startTransition(() => {
      const newAnswers = [...answers, answerIndex]
      setAnswers(newAnswers)

      if (currentQuestion + 1 < mockLesson.questions.length) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowResults(true)
      }
    })
  }

  const calculateScore = () => {
    const correctAnswers = answers.filter(
      (answer, index) => answer === mockLesson.questions[index].correctAnswer
    )
    return (correctAnswers.length / mockLesson.questions.length) * 100
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Practice</h1>
        <p className="text-muted-foreground">
          Learn and practice with interactive lessons and quizzes.
        </p>
      </div>

      {currentStep === "lesson" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{mockLesson.title}</CardTitle>
                <CardDescription>Read the lesson carefully before taking the quiz</CardDescription>
              </div>
              <Badge variant="secondary">5 min read</Badge>
            </div>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{mockLesson.content}</div>
          </CardContent>
          <CardFooter>
            <Button onClick={startQuiz} className="ml-auto">
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === "questions" && !showResults && (
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <Progress value={(currentQuestion / mockLesson.questions.length) * 100} />
              <div className="flex items-center justify-between">
                <CardTitle>Question {currentQuestion + 1} of {mockLesson.questions.length}</CardTitle>
                <div className="flex items-center text-muted-foreground">
                  <Timer className="mr-2 h-4 w-4" />
                  <span className="text-sm">Time remaining: 2:30</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium">
              {mockLesson.questions[currentQuestion].text}
            </p>
            <div className="grid gap-2">
              {mockLesson.questions[currentQuestion].options.map((option, index) => (
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
          </CardContent>
        </Card>
      )}

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>
              Here's how you performed on the quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{calculateScore()}%</div>
              <p className="text-muted-foreground">
                You answered {answers.filter((answer, index) => answer === mockLesson.questions[index].correctAnswer).length} out of {mockLesson.questions.length} questions correctly
              </p>
            </div>

            <div className="space-y-4">
              {mockLesson.questions.map((question, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium">{question.text}</div>
                    <Badge variant={answers[index] === question.correctAnswer ? "default" : "destructive"}>
                      {answers[index] === question.correctAnswer ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded ${
                          optionIndex === question.correctAnswer
                            ? "bg-primary/10 text-primary"
                            : optionIndex === answers[index]
                            ? "bg-destructive/10 text-destructive"
                            : ""
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setCurrentStep("lesson")} className="w-full">
              Return to Lesson
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
} 