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
import { Trainee } from "@/lib/types/trainee"

interface TraineeDetailsProps {
  trainee: Trainee | null
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
          <DialogDescription className="flex items-center gap-2 text-sm">
            {trainee.email}
            <span>•</span>
            Last active {new Date(trainee.lastActivity).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-auto pr-4">
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
            {/* <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Assigned Lessons</h3>
                <Badge variant="secondary">
                  {trainee.stats.totalAssigned} lessons
                </Badge>
              </div>
              
              {!trainee.assignedLessons || trainee.assignedLessons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-4 opacity-50" />
                  <p className="text-sm font-medium">No lessons assigned yet</p>
                  <p className="text-sm">Assign lessons to this trainee to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trainee.assignedLessons.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{assignment.lesson?.title}</div>
                          <Badge 
                            variant={getStatusColor(assignment.status)}
                            className="capitalize flex items-center gap-1.5"
                          >
                            {getStatusIcon(assignment.status)}
                            <span>{assignment.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {assignment.assignedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Assigned {new Date(assignment.assignedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                          {assignment.completedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Completed {new Date(assignment.completedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={assignment.progress} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {assignment.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 