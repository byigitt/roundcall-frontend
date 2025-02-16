"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { getAuthHeader } from "@/lib/auth/tokens"
import { LessonList } from "./components/lesson-list"
import { LessonContent } from "./components/lesson-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AssignedLesson, LessonContent as LessonContentType } from "@/lib/services/lesson-service"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

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
      const response = await fetch(`${API_URL}/lessons/assigned/my-lessons`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        credentials: 'include',
      })

      const data = await response.json()
      console.log("Raw API Response:", JSON.stringify(data, null, 2));
      
      if (data.length > 0) {
        try {
          // First, let's fetch the lesson details for each assignment
          const lessonDetailsPromises = data.map(async (assignment: any) => {
            const lessonResponse = await fetch(`${API_URL}/lessons/${assignment.lessonID}`, {
              headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
              },
              credentials: 'include',
            });
            return lessonResponse.json();
          });

          const lessonDetails = await Promise.all(lessonDetailsPromises);
          console.log("Lesson Details:", JSON.stringify(lessonDetails, null, 2));

          const mappedLessons: AssignedLesson[] = data.map((assignment: any, index: number) => ({
            id: assignment.id,
            lessonID: assignment.lessonID,
            traineeID: assignment.traineeID,
            trainerID: assignment.trainerID,
            status: assignment.status,
            startedAt: assignment.startedAt,
            completedAt: assignment.completedAt,
            assignedAt: assignment.assignedAt,
            progress: assignment.progress || 0,
            lesson: {
              title: lessonDetails[index].title,
              description: lessonDetails[index].description,
              contentType: lessonDetails[index].contentType,
              textContent: lessonDetails[index].textContent || '',
              videoURL: lessonDetails[index].videoURL,
              timeBased: lessonDetails[index].timeBased,
              questions: lessonDetails[index].questions || [],
              createdAt: lessonDetails[index].createdAt || new Date().toISOString(),
              createdBy: lessonDetails[index].createdBy || 'Unknown'
            }
          }));
          
          console.log("Mapped Lessons:", JSON.stringify(mappedLessons, null, 2));
          setLessons(mappedLessons)
        } catch (error) {
          console.error("Error mapping lessons:", error);
        }
      } else {
        setLessons([])
      }
    } catch (error) {
      console.error("Fetch error:", error);
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
      const response = await fetch(`${API_URL}/lessons/assigned/${lessonId}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      })

      const data = await response.json()
      console.log("Update Lesson Status Response:", JSON.stringify(data, null, 2)); 
      if (data.status) {
        fetchAssignedLessons()
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
      const response = await fetch(`${API_URL}/lessons/assigned/${lessonId}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
        body: JSON.stringify({ progress })
      })

      const data = await response.json()
      console.log("Update Lesson Progress Response:", JSON.stringify(data, null, 2));
      if (data.id) {
        if (progress === 100) {
          toast({
            title: "Success",
            description: "Lesson completed successfully!",
          })
        }
        
        const lesson = lessons.find(l => l.id === lessonId)
        if (lesson && progress > 0) {
          await updateLessonStatus(lessonId, 'In Progress')
        }
        
        fetchAssignedLessons()
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
    if (lesson.status === 'Completed') {
      toast({
        title: "Lesson Completed",
        description: "You have already completed this lesson.",
      })
      return
    }
    setSelectedLesson(lesson)
    setActiveTab("content")
  }

  const handleStartReading = async () => {
    if (!selectedLesson) return
    setIsReading(true)
  }

  const handleComplete = async () => {
    if (!selectedLesson) return
    await updateLessonProgress(selectedLesson.id, 100)
    await updateLessonStatus(selectedLesson.id, 'Completed')
    await fetchAssignedLessons()
    setActiveTab("list")
    setSelectedLesson(null)
    setIsReading(false)
    
    toast({
      title: "Success",
      description: "Lesson completed successfully! You can find it in your completed lessons.",
    })
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
            lessons={lessons}
            isLoading={isLoading}
            onView={handleViewLesson}
          />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          {selectedLesson?.lesson && (
            <LessonContent
              lesson={selectedLesson.lesson}
              onUpdateProgress={(progress) => updateLessonProgress(selectedLesson.id, progress)}
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