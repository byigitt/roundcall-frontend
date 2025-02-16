"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Mail, Loader2, X, UserPlus, Users, Clock, BarChart, HourglassIcon, Timer, CheckCircle2, AlertCircle } from "lucide-react"
import { Lesson } from "./types"
import { useToast } from "@/hooks/use-toast"
import { getAuthHeader } from "@/lib/auth/tokens"

interface Trainee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  totalAssignedLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  notStartedLessons: number;
  completionRate: number;
}

interface TraineeLesson {
  _id: string
  lesson: {
    _id: string
    title: string
    contentType: string
    difficulty: string
  } | null
  trainee: string
  assignedBy: string
  status: 'pending' | 'in_progress' | 'completed' | 'expired'
  progress: number
  createdAt: string
  updatedAt: string
  lastAccessedAt: string
  dueDate?: string
}

interface TraineeWithLessons {
  _id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  lessons: TraineeLesson[]
}
interface AssignedTrainee {
  _id: string
  lesson: string
  traineeID: string
  trainerID: string
  trainee?: {
    _id: string
    email: string
    firstName: string
    lastName: string
    totalAssignedLessons: number
    completedLessons: number
    inProgressLessons: number
    completionRate: number
  }
  status: 'Assigned' | 'In Progress' | 'Completed' | 'Expired'
  assignedAt: string
  completedAt: string
}

interface AssignedLesson {
  _id: string;
  lesson: {
    _id: string;
    title: string;
  };
  trainee: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  createdAt: string;
}

interface AssignLessonDialogProps {
  lesson: Lesson | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export function AssignLessonDialog({
  lesson,
  open,
  onOpenChange,
}: AssignLessonDialogProps) {
  const { toast } = useToast()
  const [traineeEmail, setTraineeEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [assignedTrainees, setAssignedTrainees] = useState<AssignedTrainee[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open && lesson) {
      fetchAssignedTrainees()
    }
  }, [open, lesson])

  async function fetchAssignedTrainees() {
    if (!lesson) return
    
    setIsLoading(true)
    try {
      // First, get all assigned lessons
      const assignedResponse = await fetch(`${API_URL}/lessons/assigned`, {
        headers: {
          ...getAuthHeader()
        },
        credentials: 'include',
      })
      const assignedData = await assignedResponse.json()
      
      if (Array.isArray(assignedData)) {
        // Filter assignments for current lesson
        const currentLessonAssignments = assignedData.filter(
          assignment => assignment.lesson?._id === lesson._id
        )
        
        // Get trainee details
        const traineesResponse = await fetch(`${API_URL}/users/assigned-trainees`, {
          headers: {
            ...getAuthHeader()
          },
          credentials: 'include',
        })
        const traineesData = await traineesResponse.json()
        
        // Map assignments with detailed trainee info
        const mappedAssignments = currentLessonAssignments.map(assignment => {
          const traineeDetails = traineesData.find(
            (trainee: any) => trainee._id === assignment.trainee?._id
          )
          
          return {
            _id: assignment._id,
            lesson: assignment.lesson?._id,
            traineeID: assignment.trainee?._id,
            trainerID: assignment.assignedBy,
            trainee: traineeDetails ? {
              _id: traineeDetails._id,
              email: traineeDetails.email,
              firstName: traineeDetails.firstName,
              lastName: traineeDetails.lastName,
              totalAssignedLessons: traineeDetails.totalAssignedLessons || 0,
              completedLessons: traineeDetails.completedLessons || 0,
              inProgressLessons: traineeDetails.inProgressLessons || 0,
              completionRate: traineeDetails.completionRate || 0
            } : {
              _id: assignment.trainee?._id,
              email: assignment.trainee?.email || '',
              firstName: assignment.trainee?.firstName || 'Unknown',
              lastName: assignment.trainee?.lastName || 'User',
              totalAssignedLessons: 0,
              completedLessons: 0,
              inProgressLessons: 0,
              completionRate: 0
            },
            status: assignment.status || 'Assigned',
            assignedAt: assignment.createdAt,
            completedAt: assignment.completedAt
          }
        })

        console.log('Mapped assignments:', mappedAssignments)
        setAssignedTrainees(mappedAssignments)
      } else {
        console.error('Invalid assigned data format:', assignedData)
        toast({
          variant: "destructive", 
          title: "Error",
          description: "Failed to fetch assigned trainees"
        })
      }
    } catch (error) {
      console.error('Error fetching assigned trainees:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch assigned trainees"
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAssign() {
    if (!lesson || !traineeEmail) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/lessons/${lesson.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
        body: JSON.stringify({
          trainee_email: traineeEmail
        })
      })

      const data = await response.json()
      console.log('Assign response:', data)
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Lesson assigned successfully"
        })
        setTraineeEmail("")
        fetchAssignedTrainees()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to assign lesson"
        })
      }
    } catch (error) {
      console.error('Error assigning lesson:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign lesson"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUnassign(assignmentId: string) {
    if (!lesson) return

    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/lessons/assigned/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Assignment removed successfully"
        })
        fetchAssignedTrainees()
      } else {
        const data = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Failed to remove assignment"
        })
      }
    } catch (error) {
      console.error('Error removing assignment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove assignment"
      })
    } finally {
      setIsLoading(false)
    }
  }

  function getStatusColor(status: AssignedTrainee['status']) {
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

  function getStatusIcon(status: AssignedTrainee['status']) {
    switch (status) {
      case 'Assigned':
        return <HourglassIcon className="h-3 w-3" />
      case 'In Progress':
        return <Timer className="h-3 w-3" />
      case 'Completed':
        return <CheckCircle2 className="h-3 w-3" />
      case 'Expired':
        return <AlertCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Lesson Assignment</DialogTitle>
          <DialogDescription>
            Assign this lesson to trainees or manage existing assignments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assign New Trainee Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <UserPlus className="h-4 w-4" />
              Assign New Trainee
            </div>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter trainee's email"
                value={traineeEmail}
                onChange={(e) => setTraineeEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAssign}
                disabled={!traineeEmail || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assign
              </Button>
            </div>
          </div>

          <Separator />

          {/* Assigned Trainees List */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Assigned Trainees
            </div>
            
            <ScrollArea className="h-[300px] rounded-md border p-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : assignedTrainees.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  No trainees assigned yet
                </div>
              ) : (
                <div className="space-y-2">
                  {assignedTrainees.map((assignment) => {
                    // Find trainee details from the trainees data
                    const traineeDetails = assignedTrainees.find(
                      (trainee: any) => trainee.id === assignment.traineeID
                    );
                    
                    return (
                      <div 
                        key={assignment._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">
                                {traineeDetails?.trainee?.firstName} {traineeDetails?.trainee?.lastName}
                              </p>
                              <Badge variant={getStatusColor(assignment.status)} className="capitalize">
                                <div className="flex items-center gap-1.5">
                                  {getStatusIcon(assignment.status)}
                                  <span>{assignment.status.replace('_', ' ')}</span>
                                </div>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="truncate">{traineeDetails?.trainee?.email}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { console.log(assignment); handleUnassign(assignment._id)}}
                          className="h-8 w-8 shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 