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
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Search, Eye, Clock, HourglassIcon, Timer, CheckCircle2, AlertCircle } from "lucide-react"

interface AssignedLesson {
  _id: string
  lesson: {
    _id: string
    title: string
    description: string
    contentType: string
    difficulty: string
  }
  status: 'pending' | 'in_progress' | 'completed' | 'expired'
  progress: number
  startedAt: string
  lastAccessedAt: string
  dueDate?: string
}

interface LessonListProps {
  lessons: AssignedLesson[]
  isLoading: boolean
  onView: (lesson: AssignedLesson) => void
}

export function LessonList({
  lessons,
  isLoading,
  onView,
}: LessonListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = 
      lesson.lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.lesson.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && lesson.status === statusFilter
  })

  function getStatusColor(status: AssignedLesson['status']) {
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

  function getStatusIcon(status: AssignedLesson['status']) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Lessons</CardTitle>
        <CardDescription>
          View and access your assigned training lessons
        </CardDescription>
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
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
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No lessons found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson._id}
                className="flex items-start justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{lesson.lesson.title}</div>
                    <Badge variant={getStatusColor(lesson.status)} className="capitalize">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(lesson.status)}
                        <span>{lesson.status.replace('_', ' ')}</span>
                      </div>
                    </Badge>
                  </div>
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
                      Started {new Date(lesson.startedAt).toLocaleDateString()}
                    </div>
                    {lesson.dueDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due {new Date(lesson.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    <Progress value={lesson.progress} className="h-2" />
                    <div className="text-xs text-right text-muted-foreground">
                      {lesson.progress}% complete
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(lesson)}
                  className="ml-4"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 