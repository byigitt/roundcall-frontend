"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { getAuthHeader } from "@/lib/auth/tokens"
import { TraineeList } from "./trainee-list"
import { TraineeDetails } from "./trainee-details"
import { Trainee } from "@/lib/types/trainee"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function TraineesPage() {
  const { toast } = useToast()
  const [trainees, setTrainees] = useState<Trainee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    fetchTrainees()
  }, [])

  async function fetchTrainees() {
    try {
      const response = await fetch(`${API_URL}/users/assigned-trainees`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        credentials: 'include',
      })

      const data = await response.json()
      if (Array.isArray(data)) {
        // Map API response to match our Trainee type
        const mappedTrainees: Trainee[] = data.map(trainee => ({
          ...trainee,
          stats: {
            totalAssigned: trainee.totalAssignedLessons,
            completed: trainee.completedLessons,
            inProgress: trainee.inProgressLessons,
            pending: trainee.notStartedLessons,
            expired: 0,
            averageProgress: trainee.completionRate
          },
          role: trainee.role || 'Trainee',
          lessons: trainee.lessons || [],
          lastActivity: trainee.lastActivity || new Date().toISOString()
        }))
        setTrainees(mappedTrainees)
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