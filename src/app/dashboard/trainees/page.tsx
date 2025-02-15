"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { getAuthHeader } from "@/lib/auth/tokens"
import { TraineeList } from "./trainee-list"
import { TraineeDetails } from "./trainee-details"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api"

interface TraineeWithLessons {
  _id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  lessons: {
    _id: string
    lesson: {
      _id: string
      title: string
      contentType: string
      difficulty: string
    }
    status: 'pending' | 'in_progress' | 'completed' | 'expired'
    progress: number
    startedAt: string
    lastAccessedAt: string
    dueDate?: string
  }[]
  stats: {
    totalAssigned: number
    completed: number
    inProgress: number
    pending: number
    expired: number
    averageProgress: number
  }
  lastActivity: string
}

export default function TraineesPage() {
  const { toast } = useToast()
  const [trainees, setTrainees] = useState<TraineeWithLessons[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTrainee, setSelectedTrainee] = useState<TraineeWithLessons | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    fetchTrainees()
  }, [])

  async function fetchTrainees() {
    try {
      const response = await fetch(`${API_URL}/users/my-trainees/lessons`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        credentials: 'include',
      })

      const data = await response.json()
      if (data.status === "success") {
        setTrainees(data.data.trainees)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch trainees.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch trainees.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trainees</h1>
        <p className="text-muted-foreground">
          Monitor your trainees' progress and lesson completion status.
        </p>
      </div>

      <TraineeList
        trainees={trainees}
        isLoading={isLoading}
        onView={(trainee) => {
          setSelectedTrainee(trainee)
          setDetailsOpen(true)
        }}
      />

      <TraineeDetails
        trainee={selectedTrainee}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  )
} 