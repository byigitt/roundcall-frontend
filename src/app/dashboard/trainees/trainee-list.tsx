"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Eye, BarChart2, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

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

interface TraineeListProps {
  trainees: TraineeWithLessons[]
  isLoading: boolean
  onView: (trainee: TraineeWithLessons) => void
}

export function TraineeList({
  trainees,
  isLoading,
  onView,
}: TraineeListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredTrainees = trainees.filter(trainee => {
    const matchesSearch = 
      trainee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === "all") return matchesSearch

    const hasLessonsWithStatus = trainee.lessons.some(lesson => 
      statusFilter === "active" 
        ? lesson.status === "in_progress"
        : lesson.status === statusFilter
    )

    return matchesSearch && hasLessonsWithStatus
  })

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Trainees</CardTitle>
        <CardDescription>
          View and monitor trainee progress across assigned lessons
        </CardDescription>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trainees..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTrainees.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No trainees found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainee</TableHead>
                <TableHead>Assigned Lessons</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainees.map((trainee) => (
                <TableRow key={trainee._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {trainee.firstName} {trainee.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {trainee.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {trainee.stats.totalAssigned} Lessons
                      </div>
                      <div className="text-xs text-muted-foreground space-x-2">
                        <span>{trainee.stats.completed} completed</span>
                        <span>•</span>
                        <span>{trainee.stats.inProgress} in progress</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Progress value={trainee.stats.averageProgress} className="h-2" />
                        <span className="text-sm font-medium">
                          {trainee.stats.averageProgress}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {trainee.lessons.length > 0 ? (
                        trainee.lessons.slice(0, 2).map((lesson) => (
                          <Badge 
                            key={lesson._id}
                            variant={getStatusColor(lesson.status)}
                            className="capitalize"
                          >
                            {lesson.status.replace('_', ' ')}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary">No lessons</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(trainee.lastActivity).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(trainee)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
} 