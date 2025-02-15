"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { getAuthHeader } from "@/lib/auth/tokens"
import { LessonList } from "./components/lesson-list"
import { LessonDetails } from "./components/lesson-details"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api"

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

export default function LessonsPage() {
  const { toast } = useToast()
  const [lessons, setLessons] = useState<AssignedLesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<AssignedLesson | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    fetchAssignedLessons()
  }, [])

  async function fetchAssignedLessons() {
    try {
      const response = await fetch(`${API_URL}/assigned-lessons/my-lessons`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        credentials: 'include',
      })

      const data = await response.json()
      if (data.status === "success") {
        setLessons(data.data.lessons)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch assigned lessons.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch assigned lessons.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function updateLessonStatus(lessonId: string, status: AssignedLesson['status']) {
    try {
      const response = await fetch(`${API_URL}/assigned-lessons/${lessonId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      })

      const data = await response.json()
      if (data.status === "success") {
        toast({
          title: "Success",
          description: "Lesson status updated successfully",
        })
        fetchAssignedLessons() // Refresh the list
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to update lesson status",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lesson status",
      })
    }
  }

  async function updateLessonProgress(lessonId: string, progress: number) {
    try {
      const response = await fetch(`${API_URL}/assigned-lessons/${lessonId}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
        body: JSON.stringify({ progress })
      })

      const data = await response.json()
      if (data.status === "success") {
        // Only show toast for completion
        if (progress === 100) {
          toast({
            title: "Success",
            description: "Lesson completed successfully!",
          })
        }
        fetchAssignedLessons() // Refresh the list
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to update lesson progress",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lesson progress",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Lessons</h1>
        <p className="text-muted-foreground">
          View and complete your assigned lessons.
        </p>
      </div>

      <LessonList
        lessons={lessons}
        isLoading={isLoading}
        onView={(lesson) => {
          setSelectedLesson(lesson)
          setDetailsOpen(true)
        }}
      />

      <LessonDetails
        lesson={selectedLesson}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onUpdateStatus={updateLessonStatus}
        onUpdateProgress={updateLessonProgress}
      />
    </div>
  )
} 