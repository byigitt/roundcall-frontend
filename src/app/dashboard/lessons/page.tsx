"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { getAuthHeader } from "@/lib/auth/tokens"
import { LessonList } from "./components/lesson-list"
import { LessonContent } from "./components/lesson-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Lesson } from "@/lib/services/lesson-service"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const adaptLessonType = (lesson: AssignedLesson['lesson']) => ({
  title: lesson.title,
  description: lesson.description,
  contentType: lesson.contentType as "Text" | "Video" | "Both",
  textContent: lesson.textContent,
  videoURL: lesson.videoUrl,
  timeBased: lesson.duration
})

export interface AssignedLesson {
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
  const [activeTab, setActiveTab] = useState("list")
  const [isReading, setIsReading] = useState(false)

  useEffect(() => {
    fetchAssignedLessons()
  }, [])

  async function fetchAssignedLessons() {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/assigned-lessons/my-lessons`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        credentials: 'include',
      })

      const data = await response.json()
      if (data.status == "success" && data.data?.assignments) {
        try {
          console.log(data.data.assignments);
          const mappedLessons = data.data.assignments
            .filter((assignment: any) => assignment.lesson) // Filter out assignments with null lessons
            .map((assignment: any) => ({
              _id: assignment._id,
              lesson: {
                _id: assignment.lesson._id,
                title: assignment.lesson.title,
                description: assignment.lesson.description,
                contentType: assignment.lesson.contentType,
                textContent: assignment.lesson.textContent,
                videoUrl: assignment.lesson.videoUrl,
                duration: assignment.lesson.duration,
                displayTime: assignment.lesson.displayTime,
                difficulty: assignment.lesson.difficulty,
                questions: assignment.lesson.questions || []
              },
              status: assignment.status,
              progress: assignment.progress,
              startedAt: assignment.createdAt,
              lastAccessedAt: assignment.lastAccessedAt,
              dueDate: assignment.dueDate
            }));
          setLessons(mappedLessons)
        } catch (error) {
          console.error("Error mapping lessons:", error);
        }
      } else {
        setLessons([])
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch assigned lessons.",
        })
      }
    } catch (error) {
      setLessons([])
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
      const response = await fetch(`${API_URL}/assigned-lessons/${lessonId}/progress`, {
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
        
        // If progress is more than 0 and status is pending, update to in_progress
        const lesson = lessons.find(l => l._id === lessonId)
        if (lesson && progress > 0 && lesson.status === 'pending') {
          await updateLessonStatus(lessonId, 'in_progress')
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

  const handleViewLesson = (lesson: AssignedLesson) => {
    setSelectedLesson(lesson)
    setActiveTab("content")
  }

  const handleStartReading = async () => {
    if (!selectedLesson) return
    setIsReading(true)
  }

  const handleComplete = async () => {
    if (!selectedLesson) return
    await updateLessonProgress(selectedLesson._id, 100)
    await updateLessonStatus(selectedLesson._id, 'completed')
    setActiveTab("list")
    setSelectedLesson(null)
    setIsReading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Lessons</h1>
        <p className="text-muted-foreground">
          View and complete your assigned lessons.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Lesson List</TabsTrigger>
          {selectedLesson && (
            <TabsTrigger value="content">Current Lesson</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <LessonList
            lessons={lessons.map(l => adaptLessonType(l.lesson))}
            isLoading={isLoading}
            onView={(lesson) => handleViewLesson(lessons.find(l => l.lesson.title === lesson.title)!)}
          />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          {selectedLesson && (
            <LessonContent
              lesson={adaptLessonType(selectedLesson.lesson)}
              onUpdateProgress={(progress) => updateLessonProgress(selectedLesson._id, progress)}
              onComplete={handleComplete}
              onStartReading={handleStartReading}
              isReading={isReading}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 