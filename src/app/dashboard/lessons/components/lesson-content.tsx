"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Timer, Play, CheckCircle, BookOpen, Video, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getAuthHeader } from "@/lib/auth/tokens"
import { Lesson, Question, LessonStatus } from "@/lib/services/lesson-service"

interface LessonContentProps {
  lesson: Lesson
  onUpdateProgress: (progress: number) => Promise<void>
  onComplete: () => Promise<void>
  onStartReading: () => Promise<void>
  isReading: boolean
}

export function LessonContent({
  lesson,
  onUpdateProgress,
  onComplete,
  onStartReading,
  isReading,
}: LessonContentProps) {
  const { toast } = useToast()
  const [showContent, setShowContent] = useState(false)
  const [hasStartedReading, setHasStartedReading] = useState(false)
  const [hasFinishedReading, setHasFinishedReading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(lesson.timeBased ? lesson.timeBased * 60 * 1000 : 0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [hasPassed, setHasPassed] = useState(false)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)

  useEffect(() => {
    if (isReading && !hasStartedReading) {
      setHasStartedReading(true)
      setShowContent(true)
      if (lesson.timeBased) {
        const timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 0) {
              clearInterval(timer)
              setShowContent(false)
              return 0
            }
            return prev - 1000
          })
        }, 1000)
        return () => clearInterval(timer)
      }
    }
  }, [isReading, hasStartedReading, lesson.timeBased])

  useEffect(() => {
    if (hasFinishedReading) {
      fetchQuestions()
    }
  }, [hasFinishedReading])

  const fetchQuestions = async () => {
    if (!lesson.id) return
    setIsLoadingQuestions(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/lesson/${lesson.id}`, {
        headers: getAuthHeader(),
      })
      if (!response.ok) throw new Error("Failed to fetch questions")
      const data = await response.json()
      setQuestions(data)
      setAnswers(new Array(data.length).fill(-1))
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load questions. Please try again.",
      })
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  const handleFinishReading = () => {
    setHasFinishedReading(true)
    setShowContent(false)
  }

  const handleComplete = async () => {
    setShowResults(true)
    const correctAnswers = answers.filter((answer, index) => 
      answer === parseInt(questions[index].correctAnswer)
    ).length
    const totalQuestions = questions.length
    const score = (correctAnswers / totalQuestions) * 100

    if (score >= 70) { // Pass threshold
      setHasPassed(true)
      await onUpdateProgress(100)
      toast({
        title: "Congratulations! 🎉",
        description: "You've successfully completed this lesson.",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Not quite there",
        description: "You need 70% to pass. Review the content and try again.",
      })
    }
  }

  const handleFinishLesson = async () => {
    await onComplete()
  }

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[questionIndex] = answerIndex
      return newAnswers
    })
  }

  const allQuestionsAnswered = answers.every(answer => answer !== -1)

  if (!isReading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 p-6">
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="px-6 py-3 text-lg font-medium">
            {lesson.timeBased ? (
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Timed Reading ({lesson.timeBased} minutes)
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Regular Reading
              </div>
            )}
          </Badge>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{lesson.title}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
              {lesson.timeBased 
                ? "This content will be available for a limited time only. Make sure you're ready before starting."
                : "Take your time to read and understand the content. Click 'Finished Reading' when you're done."
              }
            </p>
          </div>
        </div>
        <Button 
          onClick={onStartReading} 
          size="lg"
          className="flex items-center gap-3 px-8 py-6 text-lg font-medium transition-all hover:scale-105 shadow-lg"
        >
          <Play className="h-5 w-5" />
          Start Reading
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-background sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{lesson.title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {hasFinishedReading ? 'Complete the questions below' : hasStartedReading ? 'Reading in progress...' : 'Ready to start'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!hasStartedReading ? (
            <Button 
              onClick={onStartReading} 
              variant="outline"
              size="lg"
              className="font-medium"
            >
              Start Reading
            </Button>
          ) : !hasFinishedReading ? (
            <Button 
              onClick={handleFinishReading} 
              variant="outline"
              size="lg"
              className="font-medium"
            >
              Finished Reading
            </Button>
          ) : (
            <>
              {!showResults && questions && questions.length > 0 && (
                <Button 
                  onClick={handleComplete}
                  size="lg"
                  className="flex items-center gap-2 font-medium"
                  disabled={!allQuestionsAnswered}
                >
                  <CheckCircle className="h-5 w-5" />
                  Submit Answers
                </Button>
              )}
              {(hasPassed || !questions || questions.length === 0) && (
                <Button
                  onClick={handleFinishLesson}
                  size="lg"
                  variant="default"
                  className="flex items-center gap-2 font-medium"
                >
                  Return to Lessons
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Timer for timed content */}
      {lesson.timeBased && hasStartedReading && !hasFinishedReading && (
        <div className="px-6 py-4 border-b bg-background">
          <div className="bg-muted rounded-lg p-4 border shadow-sm max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm font-medium">Time Remaining</span>
                <div className="text-xs text-muted-foreground">Content will be hidden when timer expires</div>
              </div>
              <div className="text-3xl font-bold tabular-nums tracking-tight">
                {Math.max(0, Math.floor(timeLeft / 1000))}s
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
          {!hasFinishedReading ? (
            <>
              {showContent && lesson.textContent && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <div className="bg-card p-8 md:p-10 rounded-xl border shadow-sm">
                    <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words">
                      {lesson.textContent}
                    </p>
                  </div>
                </div>
              )}

              {lesson.videoURL && (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Content
                  </h4>
                  <div className="aspect-video rounded-xl overflow-hidden border shadow-sm">
                    <iframe
                      src={lesson.videoURL}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-8">
              {isLoadingQuestions ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading questions...</span>
                    </div>
                  </CardContent>
                </Card>
              ) : questions.length > 0 ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Lesson Questions</CardTitle>
                      <CardDescription>
                        Answer all questions to complete the lesson. You need 70% to pass.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {questions.map((question, index) => (
                          <div key={question.id} className="space-y-4">
                            <div className="font-medium">
                              {index + 1}. {question.questionText}
                            </div>
                            <RadioGroup
                              value={answers[index]?.toString()}
                              onValueChange={(value) => handleAnswerChange(index, parseInt(value))}
                            >
                              {Object.entries(question.options).map(([key, value]) => (
                                <div key={key} className="flex items-center space-x-2">
                                  <RadioGroupItem value={key} id={`q${index}-${key}`} />
                                  <Label htmlFor={`q${index}-${key}`}>{value}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                            {showResults && (
                              <div className={`text-sm ${answers[index] === parseInt(question.correctAnswer) ? 'text-green-500' : 'text-red-500'}`}>
                                {answers[index] === parseInt(question.correctAnswer) ? 'Correct!' : `Incorrect. The correct answer was: ${question.options[question.correctAnswer]}`}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Lesson Complete</CardTitle>
                    <CardDescription>
                      This lesson has no questions. You can now return to the lesson list.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-muted-foreground">
                        You have successfully completed the reading portion of this lesson.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 