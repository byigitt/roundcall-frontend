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
import { Card, CardContent } from "@/components/ui/card"

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
  const [traineesData, setTraineesData] = useState<Trainee[]>([])
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
      console.log('Assigned lessons data:', assignedData)
      console.log('Current lesson ID:', lesson._id, 'or', lesson.id)
      
      // Get trainee details
      const traineesResponse = await fetch(`${API_URL}/users/assigned-trainees`, {
        headers: {
          ...getAuthHeader()
        },
        credentials: 'include',
      })
      const traineesData = await traineesResponse.json()
      console.log('Trainees data:', traineesData)
      setTraineesData(traineesData)
      
      if (Array.isArray(assignedData)) {
        // Filter assignments for current lesson
        const currentLessonAssignments = assignedData.filter(assignment => {
          console.log('Checking assignment:', assignment)
          const assignmentLessonId = assignment.lessonID || assignment.lessonId || assignment.lesson?._id || assignment.lesson?.id
          console.log('Assignment lesson ID:', assignmentLessonId)
          const currentLessonId = lesson._id || lesson.id
          console.log('Current lesson ID to match:', currentLessonId)
          return assignmentLessonId === currentLessonId
        })
        console.log('Filtered lesson assignments:', currentLessonAssignments)
        
        // Map assignments with detailed trainee info
        const mappedAssignments = currentLessonAssignments.map(assignment => {
          const traineeId = assignment.traineeID || assignment.traineeId || assignment.trainee?._id || assignment.trainee?.id
          const traineeDetails = traineesData.find(
            (trainee: any) => trainee.id === traineeId
          )
          
          console.log('Found trainee details:', traineeDetails, 'for trainee ID:', traineeId)
          
          return {
            _id: assignment._id || assignment.id,
            lesson: assignment.lessonID || assignment.lessonId || assignment.lesson?._id || assignment.lesson?.id,
            traineeID: assignment.traineeID || assignment.traineeId || assignment.trainee?._id || assignment.trainee?.id,
            trainerID: assignment.trainerID || assignment.trainerId || assignment.assignedBy,
            trainee: traineeDetails ? {
              _id: traineeDetails.id,
              email: traineeDetails.email,
              firstName: traineeDetails.firstName,
              lastName: traineeDetails.lastName,
              totalAssignedLessons: traineeDetails.totalAssignedLessons || 0,
              completedLessons: traineeDetails.completedLessons || 0,
              inProgressLessons: traineeDetails.inProgressLessons || 0,
              completionRate: traineeDetails.completionRate || 0
            } : {
              _id: traineeId,
              email: assignment.trainee?.email || '',
              firstName: assignment.trainee?.firstName || 'Unknown',
              lastName: assignment.trainee?.lastName || 'User',
              totalAssignedLessons: 0,
              completedLessons: 0,
              inProgressLessons: 0,
              completionRate: 0
            },
            status: assignment.status || 'Assigned',
            assignedAt: assignment.assignedAt || assignment.createdAt || assignment.startedAt,
            completedAt: assignment.completedAt
          }
        })

        console.log('Final mapped assignments:', mappedAssignments)
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
      const response = await fetch(`${API_URL}/lessons/assigned-lessons/${assignmentId}`, {
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
      <DialogContent className="max-w-3xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl">Manage Lesson Assignment</DialogTitle>
          <DialogDescription className="text-base">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex-1">Assign this lesson to trainees or manage existing assignments.</div>
              {lesson && (
                <Badge variant="secondary" className="px-3 py-1">
                  <span className="font-medium">{lesson.title}</span>
                </Badge>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Assign New Trainee Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Assign New Trainee</h3>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Enter trainee's email address"
                    value={traineeEmail}
                    onChange={(e) => setTraineeEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAssign}
                    disabled={!traineeEmail || isSubmitting}
                    className="min-w-[100px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Assigned Trainees List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Assigned Trainees</h3>
              </div>
              <Badge variant="secondary">
                {assignedTrainees.length} {assignedTrainees.length === 1 ? 'trainee' : 'trainees'} assigned
              </Badge>
            </div>
            
            <Card>
              <ScrollArea className="h-[350px] rounded-md">
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading assignments...</p>
                      </div>
                    </div>
                  ) : assignedTrainees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                      <Users className="h-8 w-8 mb-4 opacity-50" />
                      <p className="text-sm font-medium">No trainees assigned yet</p>
                      <p className="text-sm">Assign trainees using the form above</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {assignedTrainees.map((assignment) => {
                        const traineeDetails = traineesData.find(
                          trainee => trainee.id === assignment.traineeID
                        );
                        
                        if (!traineeDetails) return null;

                        return (
                          <li 
                            key={assignment._id}
                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Mail className="h-5 w-5 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <p className="text-sm font-medium truncate">
                                    {traineeDetails.firstName} {traineeDetails.lastName}
                                  </p>
                                  <Badge variant={getStatusColor(assignment.status)} className="capitalize">
                                    <div className="flex items-center gap-1.5">
                                      {getStatusIcon(assignment.status)}
                                      <span>{assignment.status.replace('_', ' ')}</span>
                                    </div>
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium">{traineeDetails.firstName} {traineeDetails.lastName}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="truncate">{traineeDetails.email}</span>
                                      <span>•</span>
                                      <span>Assigned {new Date(assignment.assignedAt).toLocaleDateString()}</span>
                                      {assignment.completedAt && (
                                        <>
                                          <span>•</span>
                                          <span>Completed {new Date(assignment.completedAt).toLocaleDateString()}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleUnassign(assignment._id)}
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 