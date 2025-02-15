"use client"

import { useState, useTransition, useEffect } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUserStore } from "@/lib/store/use-user-store"
import { getAuthHeader } from "@/lib/auth/tokens"
import { Lesson, User } from "./types"
import { LessonList } from "./lesson-list"
import { ViewLessonDialog } from "./view-lesson-dialog"
import { EditLessonDialog } from "./edit-lesson-dialog"
import { AssignLessonDialog } from "./assign-lesson-dialog"
import { CreateLessonForm } from "./create-lesson-form"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api"

export default function ManagePage() {
  const { toast } = useToast()
  const { user } = useUserStore()
  const [isPending, startTransition] = useTransition()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [trainees, setTrainees] = useState<User[]>([])

  useEffect(() => {
    fetchLessons()
  }, [])

  useEffect(() => {
    async function fetchTrainees() {
      try {
        const response = await fetch(`${API_URL}/users/my-trainees`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
          },
          credentials: 'include',
        })

        const data = await response.json()
        if (data.status === "success") {
          setTrainees(data.data.trainees)
        }
      } catch (error) {
        console.error('Error fetching trainees:', error)
      }
    }

    if (user?.role === 'trainer') {
      fetchTrainees()
    }
  }, [user])

  async function fetchLessons() {
    try {
      const response = await fetch(`${API_URL}/lessons`, {
        method: "GET",
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
          description: "Failed to fetch lessons.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch lessons.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function updateLesson(lessonId: string, data: any) {
    try {
      const response = await fetch(`${API_URL}/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })

      const result = await response.json()
      if (result.status === "success") {
        toast({
          title: "Success",
          description: "Lesson updated successfully",
        })
        fetchLessons()
        setEditDialogOpen(false)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error?.message || "Failed to update lesson",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lesson",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Content</h1>
        <p className="text-muted-foreground">
          Create and manage lessons and questions for your training program.
        </p>
      </div>

      <Tabs defaultValue="view" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Lesson</TabsTrigger>
          <TabsTrigger value="view">View Lessons</TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <LessonList
            lessons={lessons}
            isLoading={isLoading}
            onView={(lesson) => {
              setSelectedLesson(lesson)
              setViewDialogOpen(true)
            }}
            onEdit={(lesson) => {
              setSelectedLesson(lesson)
              setEditDialogOpen(true)
            }}
            onAssign={(lesson) => {
              setSelectedLesson(lesson)
              setAssignDialogOpen(true)
            }}
            onDelete={(lessonId) => {
              setLessons(lessons.filter(lesson => lesson._id !== lessonId))
            }}
          />
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <CreateLessonForm
            onSubmit={async (data) => {
              startTransition(async () => {
                try {
                  const response = await fetch(`${API_URL}/lessons`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...getAuthHeader()
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                  })

                  const result = await response.json()

                  if (result.status === "success") {
                    toast({
                      title: "Success",
                      description: "Lesson created successfully",
                    })
                    fetchLessons() // Refresh the lessons list
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: result.error?.message || "Failed to create lesson.",
                    })
                  }
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to create lesson. Please try again.",
                  })
                }
              })
            }}
            isPending={isPending}
          />
        </TabsContent>
      </Tabs>

      <ViewLessonDialog
        lesson={selectedLesson}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <EditLessonDialog
        lesson={selectedLesson}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={updateLesson}
      />

      <AssignLessonDialog
        lesson={selectedLesson}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />
    </div>
  )
} 