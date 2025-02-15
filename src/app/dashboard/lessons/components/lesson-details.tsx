"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Clock, HourglassIcon, Timer, CheckCircle2, AlertCircle } from "lucide-react"
import { AssignedLesson } from "../page"
import { LessonContent } from "./lesson-content"
import { LessonTracker, trackLessonAnalytics } from "./lesson-analytics"

const adaptLessonType = (lesson: AssignedLesson['lesson']) => ({
  title: lesson.title,
  description: lesson.description,
  contentType: lesson.contentType as "Text" | "Video" | "Both",
  textContent: lesson.textContent,
  videoURL: lesson.videoUrl,
  timeBased: lesson.duration
})

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
  const [isReading, setIsReading] = useState(false)

  // Track when lesson is viewed
  useEffect(() => {
    if (lesson && open) {
      trackLessonAnalytics({
        lessonId: lesson.lesson._id,
        assignmentId: lesson._id,
        event: 'view'
      })
    }
  }, [lesson, open])

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
        return <CheckCircle2 className="h-4 w-4" />
      case 'expired':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleStartReading = async () => {
    if (!lesson) return
    setIsReading(true)
    
    // Track lesson start (this will also update status to in_progress)
    await trackLessonAnalytics({
      lessonId: lesson.lesson._id,
      assignmentId: lesson._id,
      event: 'start'
    })
  }

  const handleUpdateProgress = async (progress: number) => {
    if (!lesson) return
    
    // Track progress in analytics
    await trackLessonAnalytics({
      lessonId: lesson.lesson._id,
      assignmentId: lesson._id,
      event: 'progress',
      data: { progress }
    })
  }

  const handleComplete = async () => {
    if (!lesson) return
    
    // Track completion in analytics (this will also update status to completed)
    await trackLessonAnalytics({
      lessonId: lesson.lesson._id,
      assignmentId: lesson._id,
      event: 'complete',
      data: { progress: 100 }
    })
  }

  if (!lesson) return null

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

        <LessonContent
          lesson={adaptLessonType(lesson.lesson)}
          onUpdateProgress={handleUpdateProgress}
          onComplete={handleComplete}
          onStartReading={handleStartReading}
          isReading={isReading}
        />

        <LessonTracker
          lesson={lesson}
          isReading={isReading}
        />
      </DialogContent>
    </Dialog>
  )
} 