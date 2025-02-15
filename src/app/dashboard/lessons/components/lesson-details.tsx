"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Clock, 
  Timer,
  Play,
  CheckCircle,
  AlertCircle,
  HourglassIcon,
  ArrowRight
} from "lucide-react"

interface AssignedLesson {
  _id: string
  lesson: {
    _id: string
    title: string
    description: string
    contentType: string
    textContent?: string
    videoUrl?: string
    duration?: number
    displayTime?: number
    difficulty: string
    questions: {
      questionText: string
      options: string[]
      correctAnswer: number
    }[]
  }
  status: 'pending' | 'in_progress' | 'completed' | 'expired'
  progress: number
  startedAt: string
  lastAccessedAt: string
  dueDate?: string
}

interface LessonDetailsProps {
  lesson: AssignedLesson | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (lessonId: string, status: AssignedLesson['status']) => Promise<void>
  onUpdateProgress: (lessonId: string, progress: number) => Promise<void>
}

export function LessonDetails({
  lesson,
  open,
  onOpenChange,
  onUpdateStatus,
  onUpdateProgress,
}: LessonDetailsProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [showContent, setShowContent] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (lesson?.lesson.contentType === "timed_text" && lesson.lesson.displayTime) {
      setTimeLeft(lesson.lesson.displayTime)
      setShowContent(true)

      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer)
            setShowContent(false)
            return 0
          }
          return prev - 1000 // Decrease by 1 second
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [lesson])

  function getStatusColor(status: AssignedLesson['status']) {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'in_progress':
        return 'default'
      case 'completed':
        return 'default'
      case 'expired':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  function getStatusIcon(status: AssignedLesson['status']) {
    switch (status) {
      case 'pending':
        return <HourglassIcon className="h-4 w-4" />
      case 'in_progress':
        return <Timer className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'expired':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleStart = async () => {
    if (!lesson) return
    await onUpdateStatus(lesson._id, 'in_progress')
  }

  const handleComplete = async () => {
    if (!lesson) return
    await onUpdateProgress(lesson._id, 100)
    await onUpdateStatus(lesson._id, 'completed')
  }

  if (!lesson) return null

  const canStart = lesson.status === 'pending'
  const canComplete = lesson.status === 'in_progress' && lesson.progress >= 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{lesson.lesson.title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(lesson.status)} className="capitalize">
              <div className="flex items-center gap-1.5">
                {getStatusIcon(lesson.status)}
                <span>{lesson.status.replace('_', ' ')}</span>
              </div>
            </Badge>
            {lesson.dueDate && (
              <Badge variant="outline" className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Due {new Date(lesson.dueDate).toLocaleDateString()}
              </Badge>
            )}
          </div>
          <DialogDescription>
            {lesson.lesson.description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
          <div className="space-y-6">
            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{lesson.progress}%</span>
              </div>
              <Progress value={lesson.progress} className="h-2" />
            </div>

            <Separator />

            {/* Content Section */}
            {lesson.lesson.contentType === "timed_text" && timeLeft !== null && (
              <div className="flex items-center justify-between bg-muted p-2 rounded-lg">
                <span className="text-sm font-medium">Time Remaining</span>
                <span className="text-sm">
                  {Math.max(0, Math.floor(timeLeft / 1000))} seconds
                </span>
              </div>
            )}

            {showContent && lesson.lesson.textContent && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">Content</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {lesson.lesson.textContent}
                  </p>
                </div>
              </div>
            )}

            {lesson.lesson.videoUrl && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">Video Content</h4>
                <div className="aspect-video">
                  <iframe
                    src={lesson.lesson.videoUrl}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Questions Section */}
            {lesson.lesson.questions && lesson.lesson.questions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Questions</h4>
                {lesson.lesson.questions.map((question, index) => (
                  <div key={index} className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="font-medium">{index + 1}. {question.questionText}</p>
                    <div className="ml-4 space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <Badge variant={optionIndex === question.correctAnswer ? "default" : "outline"} className="w-6 h-6 flex items-center justify-center p-0">
                            {String.fromCharCode(65 + optionIndex)}
                          </Badge>
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              {canStart && (
                <Button onClick={handleStart} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Start Lesson
                </Button>
              )}
              {canComplete && (
                <Button onClick={handleComplete} className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Complete Lesson
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 