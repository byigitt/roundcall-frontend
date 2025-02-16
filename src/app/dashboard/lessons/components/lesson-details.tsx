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
import { AssignedLesson } from "@/lib/services/lesson-service"
import { LessonContent } from "./lesson-content"
import { LessonTracker, trackLessonAnalytics } from "./lesson-analytics"

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
        lessonId: lesson.lessonID,
        assignmentId: lesson.id,
        event: 'view'
      })
    }
  }, [lesson, open])

  function getStatusColor(status: AssignedLesson['status']) {
    switch (status) {
      case 'Assigned':
        return 'secondary'
      case 'In Progress':
        return 'default'
      case 'Completed':
        return 'default'
      case 'Expired':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  function getStatusIcon(status: AssignedLesson['status']) {
    switch (status) {
      case 'Assigned':
        return <HourglassIcon className="h-4 w-4" />
      case 'In Progress':
        return <Timer className="h-4 w-4" />
      case 'Completed':
        return <CheckCircle2 className="h-4 w-4" />
      case 'Expired':
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
      lessonId: lesson.lessonID,
      assignmentId: lesson.id,
      event: 'start'
    })
  }

  const handleUpdateProgress = async (progress: number) => {
    if (!lesson) return
    
    // Track progress in analytics
    await trackLessonAnalytics({
      lessonId: lesson.lessonID,
      assignmentId: lesson.id,
      event: 'progress',
      data: { progress }
    })
  }

  const handleComplete = async () => {
    if (!lesson) return
    
    // Track completion in analytics (this will also update status to completed)
    await trackLessonAnalytics({
      lessonId: lesson.lessonID,
      assignmentId: lesson.id,
      event: 'complete',
      data: { progress: 100 }
    })
  }

  console.log(lesson);
  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{lesson.lesson?.title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(lesson.status)} className="capitalize">
              <div className="flex items-center gap-1.5">
                {getStatusIcon(lesson.status)}
                <span>{lesson.status.replace('_', ' ')}</span>
              </div>
            </Badge>
          </div>
          <DialogDescription>
            {lesson.lesson?.description}
          </DialogDescription>
        </DialogHeader>

        {lesson.lesson && (
          <LessonContent
            lesson={lesson.lesson}
            onUpdateProgress={handleUpdateProgress}
            onComplete={handleComplete}
            onStartReading={handleStartReading}
            isReading={isReading}
          />
        )}

        <LessonTracker
          lesson={lesson}
          isReading={isReading}
        />
      </DialogContent>
    </Dialog>
  )
} 