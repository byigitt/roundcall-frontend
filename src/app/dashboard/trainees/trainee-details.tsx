"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  BookOpen, 
  Clock, 
  Calendar,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  Timer,
  HourglassIcon
} from "lucide-react"

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

interface TraineeDetailsProps {
  trainee: TraineeWithLessons | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TraineeDetails({
  trainee,
  open,
  onOpenChange,
}: TraineeDetailsProps) {
  if (!trainee) return null

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in_progress':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'expired':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />
      case 'in_progress':
        return <Timer className="h-4 w-4" />
      case 'pending':
        return <HourglassIcon className="h-4 w-4" />
      case 'expired':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {trainee.firstName} {trainee.lastName}
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 text-sm">
              <span>{trainee.email}</span>
              <span>•</span>
              <span>Last active {new Date(trainee.lastActivity).toLocaleDateString()}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">Total Lessons</span>
                </div>
                <p className="text-2xl font-bold">{trainee.stats.totalAssigned}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <p className="text-2xl font-bold">{trainee.stats.completed}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-medium">In Progress</span>
                </div>
                <p className="text-2xl font-bold">{trainee.stats.inProgress}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BarChart2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Avg. Progress</span>
                </div>
                <p className="text-2xl font-bold">{trainee.stats.averageProgress}%</p>
              </div>
            </div>

            <Separator />

            {/* Lessons List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assigned Lessons</h3>
              
              {trainee.lessons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No lessons assigned yet
                </div>
              ) : (
                <div className="space-y-4">
                  {trainee.lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      className="flex items-start justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{lesson.lesson.title}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline">
                            {lesson.lesson.contentType}
                          </Badge>
                          <Badge variant="secondary">
                            {lesson.lesson.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Started {new Date(lesson.startedAt).toLocaleDateString()}
                          </div>
                          {lesson.dueDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Due {new Date(lesson.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant={getStatusColor(lesson.status)}
                          className="capitalize flex items-center gap-1"
                        >
                          {getStatusIcon(lesson.status)}
                          {lesson.status.replace('_', ' ')}
                        </Badge>
                        <div className="w-[120px] space-y-1">
                          <Progress value={lesson.progress} className="h-2" />
                          <div className="text-xs text-right text-muted-foreground">
                            {lesson.progress}% complete
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 