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
  role: string;
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
  trainee: {
    _id: string
    email: string
    firstName: string
    lastName: string
  }
  assignedBy: string
  status: 'pending' | 'in_progress' | 'completed' | 'expired'
  progress: number
  dueDate?: string
  createdAt: string
  updatedAt: string
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
      const response = await fetch(`${API_URL}/users/my-trainees/lessons?lessonId=${lesson.id}`, {
        headers: {
          ...getAuthHeader()
        },
        credentials: 'include',
      })
      const data = await response.json()
      if (data.status === "success") {
        console.log(data.data.trainees);
        try {
          const lessonTrainees = data.data.trainees
          .filter((trainee: TraineeWithLessons) => 
            Array.isArray(trainee.lessons) && trainee.lessons.length > 0
          )
          .map((trainee: TraineeWithLessons) => {
            const lessonAssignment = trainee.lessons?.find((l: TraineeLesson) => l.trainee === trainee._id)
            return {
              _id: lessonAssignment?._id || '',
              lesson: lesson.id,
              trainee: {
                _id: trainee._id,
                email: trainee.email,
                firstName: trainee.firstName,
                lastName: trainee.lastName
              },
              assignedBy: lessonAssignment?.assignedBy || '',
              status: lessonAssignment?.status || 'pending',
              progress: lessonAssignment?.progress || 0,
              dueDate: undefined,
              createdAt: lessonAssignment?.createdAt || '',
              updatedAt: lessonAssignment?.updatedAt || ''
            }
          })
          setAssignedTrainees(lessonTrainees)
        } catch (error) {
          console.error('Error fetching assigned trainees:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch assigned trainees"
          })
        }
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
      const response = await fetch(`${API_URL}/assigned-lessons/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
        body: JSON.stringify({
          lessonId: lesson.id,
          traineeEmails: [traineeEmail]
        })
      })

      const data = await response.json()
      if (data.status === "success") {
        toast({
          title: "Success",
          description: data.data.summary.newAssignments > 0 
            ? "Lesson assigned successfully"
            : "Trainee already assigned to this lesson"
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
      const response = await fetch(`${API_URL}/assigned-lessons/${assignmentId}`, {
        method: 'DELETE',
        headers: {
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

  function getStatusIcon(status: AssignedTrainee['status']) {
    switch (status) {
      case 'pending':
        return <HourglassIcon className="h-3 w-3" />
      case 'in_progress':
        return <Timer className="h-3 w-3" />
      case 'completed':
        return <CheckCircle2 className="h-3 w-3" />
      case 'expired':
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
                  {assignedTrainees.map((assignment) => (
                    <div 
                      key={assignment._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                              {assignment.trainee.firstName} {assignment.trainee.lastName}
                            </p>
                            <Badge variant={getStatusColor(assignment.status)} className="capitalize">
                              <div className="flex items-center gap-1.5">
                                {getStatusIcon(assignment.status)}
                                <span>{assignment.status.replace('_', ' ')}</span>
                              </div>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="truncate">{assignment.trainee.email}</span>
                            <div className="flex items-center gap-1">
                              <BarChart className="h-3 w-3" />
                              <span>{assignment.progress}%</span>
                            </div>
                            {assignment.dueDate && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUnassign(assignment._id)}
                        className="h-8 w-8 shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 