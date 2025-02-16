"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Timer, Play, CheckCircle, BookOpen, Video, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getAuthHeader } from "@/lib/auth/tokens"
import { LessonContent as LessonContentType } from "@/lib/services/lesson-service"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"
import { Clock, PlayCircle } from "lucide-react"
import Countdown from 'react-countdown'
import debounce from 'lodash/debounce'

interface LessonContentProps {
  lesson: LessonContentType
  onUpdateProgress: (progress: number) => Promise<void>
  onComplete: () => Promise<void>
  onStartReading: () => Promise<void>
  isReading: boolean
}

const COOLDOWN_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [hasPassed, setHasPassed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number>(0)

  // Debounced progress update function
  const debouncedUpdateProgress = useCallback(
    debounce(async (progress: number) => {
      await onUpdateProgress(progress)
      // Only show toast for 100% progress
      if (progress >= 100) {
        toast({
          title: "Progress Updated",
          description: "Lesson progress has been saved successfully.",
        })
      }
    }, 1000), 
    [onUpdateProgress, toast]
  )

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateProgress.cancel()
    }
  }, [debouncedUpdateProgress])

  // Check for existing cooldown on component mount
  useEffect(() => {
    if (!lesson.id) return // Guard against missing lesson id
    console.log('Checking for existing cooldown...')
    const cooldownEndTime = localStorage.getItem(`lesson-cooldown-${lesson.id}`)
    console.log('Stored cooldown end time:', cooldownEndTime)
    
    if (cooldownEndTime) {
      const endTime = parseInt(cooldownEndTime)
      const currentTime = Date.now()
      const timeLeft = endTime - currentTime
      console.log('Cooldown calculation:', {
        endTime,
        currentTime,
        timeLeft,
        formattedTimeLeft: formatTime(Math.floor(timeLeft / 1000))
      })

      if (timeLeft > 0) {
        console.log('Setting cooldown time left:', timeLeft)
        setCooldownTimeLeft(timeLeft)
      } else {
        console.log('Removing expired cooldown')
        localStorage.removeItem(`lesson-cooldown-${lesson.id}`)
      }
    }
  }, [lesson.id])

  // Cooldown timer effect
  useEffect(() => {
    if (!lesson.id || cooldownTimeLeft <= 0) {
      console.log('Cooldown timer not started:', { lessonId: lesson.id, cooldownTimeLeft })
      return
    }

    console.log('Starting cooldown timer with:', {
      cooldownTimeLeft,
      formattedTime: formatTime(Math.floor(cooldownTimeLeft / 1000))
    })

    const timer = setInterval(() => {
      setCooldownTimeLeft((prev) => {
        const newTimeLeft = prev - 1000
        console.log('Timer tick:', {
          previousTime: prev,
          newTimeLeft,
          formattedNewTime: formatTime(Math.floor(newTimeLeft / 1000))
        })

        if (newTimeLeft <= 0) {
          console.log('Timer completed')
          localStorage.removeItem(`lesson-cooldown-${lesson.id}`)
          clearInterval(timer)
          return 0
        }
        return newTimeLeft
      })
    }, 1000)

    return () => {
      console.log('Cleaning up timer')
      clearInterval(timer)
    }
  }, [lesson.id])

  useEffect(() => {
    if (isReading && !hasStartedReading) {
      setHasStartedReading(true)
      setShowContent(true)
      
      if (lesson.timeBased) {
        // Set start time for countdown
        setStartTime(new Date(Date.now() + lesson.timeBased * 60 * 1000))
      }
    }
  }, [isReading, hasStartedReading, lesson.timeBased])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isReading && !isCompleted && !lesson.timeBased) {
      interval = setInterval(() => {
        setTimeSpent((prev) => {
          const newTimeSpent = prev + 10
          
          // Calculate total time based on content length and time based setting
          let totalTime = 300 // Default 5 minutes
          if (lesson.timeBased) {
            totalTime = lesson.timeBased
          } else if (lesson.textContent) {
            // Estimate reading time based on text length
            // Average adult reading speed is ~250 words per minute
            const wordCount = lesson.textContent.split(/\s+/).length
            totalTime = Math.max(Math.ceil(wordCount / 250) * 60, 300) // Minimum 5 minutes
          }

          const newProgress = Math.min((newTimeSpent / totalTime) * 100, 100)
          
          setProgress(newProgress)
          onUpdateProgress(newProgress)

          if (newProgress >= 100) {
            setIsCompleted(true)
            clearInterval(interval)
          }

          return newTimeSpent
        })
      }, 5000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isReading, isCompleted, lesson.timeBased, onUpdateProgress])

  const handleFinishReading = async () => {
    setHasFinishedReading(true)
    setShowContent(false)
    
    // Initialize answers array if there are questions
    if (lesson.questions && lesson.questions.length > 0) {
      setSelectedAnswers(new Array(lesson.questions.length).fill(-1))
    } else {
      // Only auto-complete if there are no questions
      await onComplete()
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const startCooldownTimer = () => {
    if (!lesson.id) return // Guard against missing lesson id
    console.log('Starting new cooldown timer')
    const startTime = Date.now()
    const endTime = startTime + COOLDOWN_DURATION
    console.log('Cooldown timer details:', {
      startTime,
      endTime,
      duration: COOLDOWN_DURATION,
      formattedDuration: formatTime(Math.floor(COOLDOWN_DURATION / 1000))
    })
    localStorage.setItem(`lesson-cooldown-${lesson.id}`, endTime.toString())
    setCooldownTimeLeft(COOLDOWN_DURATION)
  }

  const handleSubmitAnswers = async () => {
    if (!lesson.questions.length) {
      await onComplete()
      return
    }

    const correctAnswers = selectedAnswers.reduce((count, answerIndex, questionIndex) => {
      const question = lesson.questions[questionIndex]
      const correctOptionIndex = question.options.findIndex(option => 
        typeof option === 'object' && 'isCorrect' in option && option.isCorrect
      )
      return answerIndex === correctOptionIndex ? count + 1 : count
    }, 0)

    const score = (correctAnswers / lesson.questions.length) * 100
    setHasPassed(score >= 70)
    setShowResults(true)

    if (score >= 70) {
      toast({
        title: "Congratulations! 🎉",
        description: "You've successfully completed this lesson.",
      })
      await onComplete()
      startCooldownTimer()
    } else {
      toast({
        variant: "destructive",
        title: "Not quite there",
        description: "You need 70% to pass. Review the content and try again.",
      })
    }
  }

  const formatTime = (seconds: number) => {
    // Handle negative seconds
    if (seconds <= 0) return "0:00"
    
    const totalSeconds = Math.floor(seconds)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const remainingSeconds = totalSeconds % 60

    const formattedTime = hours > 0
      ? `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
      : `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`

    console.log('Formatting time:', {
      input: seconds,
      totalSeconds,
      hours,
      minutes,
      remainingSeconds,
      formattedTime
    })

    return formattedTime
  }

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType.toLowerCase()) {
      case "text":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <PlayCircle className="h-4 w-4" />
      case "both":
        return (
          <div className="flex space-x-1">
            <BookOpen className="h-4 w-4" />
            <PlayCircle className="h-4 w-4" />
          </div>
        )
      default:
        return null
    }
  }

  // Handle back button and content protection
  const handleBack = async () => {
    if (lesson.timeBased || lesson.videoURL) {
      // Mark as failed attempt
      await onUpdateProgress(0)
      await onComplete()
      toast({
        variant: "destructive",
        title: "Lesson Failed",
        description: "Leaving a timed lesson or video lesson counts as a failed attempt.",
      })
    }
    window.history.back()
  }

  // Add a callback to handle progress updates
  const handleProgressUpdate = useCallback((total: number) => {
    const totalTime = lesson.timeBased ? lesson.timeBased * 60 * 1000 : 0
    const progress = ((totalTime - total) / totalTime) * 100
    
    // Update local progress immediately
    setProgress(progress)
    // Debounce the API call
    debouncedUpdateProgress(progress)
  }, [lesson.timeBased, debouncedUpdateProgress])

  // Update the countdown completion handler
  const handleCountdownComplete = () => {
    toast({
      title: "Time's up!",
      description: "Your time has expired. Please complete the questions to finish the lesson.",
      variant: "destructive"
    })
    
    // Call handleFinishReading but don't auto-complete
    handleFinishReading()
    
    // Only update progress to 0, but don't complete
    onUpdateProgress(0)
    
    // Don't call onComplete here - let the user answer questions if they exist
  }

  // Update the timer display JSX
  const renderTimer = () => {
    if (!lesson.timeBased || !startTime) return null

    return (
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="text-sm font-medium">Time Remaining</span>
                <div className="text-xs text-muted-foreground">
                  Complete the lesson before time expires
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <Countdown 
                date={startTime}
                onTick={({ total }) => handleProgressUpdate(total)}
                renderer={({ total, minutes, seconds, completed }) => {
                  // Calculate progress for display only
                  const totalTime = lesson.timeBased ? lesson.timeBased * 60 * 1000 : 0
                  const currentProgress = ((totalTime - total) / totalTime) * 100

                  // Render timer display
                  if (completed) {
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-destructive font-semibold">Time's up!</span>
                          <span className="text-destructive text-2xl font-bold tabular-nums">00:00</span>
                        </div>
                        <Progress 
                          value={100} 
                          className={cn(
                            "h-2",
                            "bg-destructive/20 [&>[role=progressbar]]:bg-destructive"
                          )}
                        />
                      </div>
                    )
                  }

                  const formattedMinutes = String(minutes).padStart(2, '0')
                  const formattedSeconds = String(seconds).padStart(2, '0')
                  const isWarning = minutes === 0 && seconds <= 60
                  const isCritical = minutes === 0 && seconds <= 30

                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isWarning && (
                            <span className={cn(
                              "text-sm font-medium",
                              isCritical ? "text-destructive" : "text-yellow-500 dark:text-yellow-400"
                            )}>
                              {isCritical ? "Time is running out!" : "Less than a minute left"}
                            </span>
                          )}
                        </div>
                        <span className={cn(
                          "text-2xl font-bold tabular-nums tracking-tight transition-colors",
                          isWarning && "text-yellow-500 dark:text-yellow-400",
                          isCritical && "text-destructive animate-pulse"
                        )}>
                          {formattedMinutes}:{formattedSeconds}
                        </span>
                      </div>
                      <Progress 
                        value={currentProgress} 
                        className={cn(
                          "h-2 transition-all",
                          isWarning && "bg-yellow-100 dark:bg-yellow-900/20 [&>[role=progressbar]]:bg-yellow-500",
                          isCritical && "bg-destructive/20 [&>[role=progressbar]]:bg-destructive"
                        )}
                      />
                    </div>
                  )
                }}
                onComplete={handleCountdownComplete}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isReading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{lesson.title}</CardTitle>
            <div className="flex items-center space-x-2">
              {lesson.contentType && (
                <span className="flex items-center space-x-1">
                  {getContentTypeIcon(lesson.contentType)}
                  <span>{lesson.contentType}</span>
                </span>
              )}
              {lesson.timeBased && (
                <span className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.timeBased} minutes</span>
                </span>
              )}
            </div>
          </div>
          <CardDescription>{lesson.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cooldownTimeLeft > 0 && (
            <div className="bg-muted rounded-lg p-4 border">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Timer className="h-5 w-5" />
                <div className="space-y-1">
                  <p className="font-medium">Cooldown Period</p>
                  <p className="text-sm">You can read this lesson again in {formatTime(Math.floor(cooldownTimeLeft / 1000))}</p>
                </div>
              </div>
            </div>
          )}
          {/* Only show content preview if not time-based */}
          {!lesson.timeBased && (
            <>
              {lesson.textContent && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {lesson.textContent.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
              {lesson.videoURL && (
                <div className="aspect-video">
                  <iframe
                    src={lesson.videoURL}
                    className="h-full w-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </>
          )}

          {/* Show timer warning for time-based lessons */}
          {lesson.timeBased && (
            <div className="bg-muted rounded-lg p-4 border">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Timer className="h-5 w-5" />
                <div className="space-y-1">
                  <p className="font-medium">Timed Reading</p>
                  <p className="text-sm">This content will be available for {lesson.timeBased} minutes once you start reading. Make sure you're ready before starting.</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
            {isReading && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Time spent</span>
                <span>{formatTime(timeSpent)}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            onClick={onStartReading} 
            className="w-full"
            disabled={cooldownTimeLeft > 0}
          >  
            {cooldownTimeLeft > 0 ? `Available in ${formatTime(Math.floor(cooldownTimeLeft / 1000))}` : 'Start Reading'}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-background sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
          >
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
              onClick={() => { onStartReading(); startCooldownTimer() }} 
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
              {!showResults && lesson.questions.length > 0 && (
                <Button 
                  onClick={handleSubmitAnswers}
                  size="lg"
                  className="flex items-center gap-2 font-medium"
                  disabled={selectedAnswers.length !== lesson.questions.length}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Submit Answers
                </Button>
              )}
              {(hasPassed || !lesson.questions || lesson.questions.length === 0) && (
                <Button
                  onClick={onComplete}
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
      {hasStartedReading && !hasFinishedReading && renderTimer()}

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
              {lesson.questions.length > 0 ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Lesson Questions</CardTitle>
                      <CardDescription>
                        Answer all questions to complete the lesson. You need 70% to pass.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="text-xl font-semibold">
                          Question {currentQuestionIndex + 1} of {lesson.questions.length}
                        </div>
                        
                        <div className="p-4 border rounded-lg space-y-4">
                          <div className="font-medium">{lesson.questions[currentQuestionIndex].questionText}</div>
                          
                          <div className="space-y-2">
                            {lesson.questions[currentQuestionIndex].options.map((option: string | { text: string }, index) => (
                              <button
                                key={index}
                                className={cn(
                                  "w-full text-left px-4 py-2 rounded-lg border transition-colors",
                                  selectedAnswers[currentQuestionIndex] === index
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                )}
                                onClick={() => handleAnswerSelect(index)}
                              >
                                {typeof option === 'string' ? option : option.text}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                            disabled={currentQuestionIndex === 0}
                          >
                            Previous
                          </Button>
                          
                          {currentQuestionIndex === lesson.questions.length - 1 ? (
                            <Button
                              onClick={handleSubmitAnswers}
                              disabled={selectedAnswers.length !== lesson.questions.length}
                            >
                              Submit Answers
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setCurrentQuestionIndex(i => Math.min(lesson.questions.length - 1, i + 1))}
                              disabled={selectedAnswers[currentQuestionIndex] === undefined}
                            >
                              Next
                            </Button>
                          )}
                        </div>
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