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
import { Lesson, LessonStatus } from "@/lib/services/lesson-service"

interface LessonListProps {
  lessons: Lesson[]
  isLoading: boolean
  onView: (lesson: Lesson) => void
}

export function LessonList({
  lessons,
  isLoading,
  onView,
}: LessonListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<LessonStatus | "all">("all")

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && lesson.status === statusFilter
  })

  function getStatusColor(status: LessonStatus) {
    switch (status) {
      case 'Assigned':
        return 'secondary'
      case 'In Progress':
        return 'default'
      case 'Completed':
        return 'default'
      default:
        return 'secondary'
    }
  }

  function getStatusIcon(status: LessonStatus) {
    switch (status) {
      case 'Assigned':
        return <HourglassIcon className="h-3 w-3" />
      case 'In Progress':
        return <Timer className="h-3 w-3" />
      case 'Completed':
        return <CheckCircle2 className="h-3 w-3" />
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
            onValueChange={(value) => setStatusFilter(value as LessonStatus | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
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
                key={lesson.id}
                className="flex items-start justify-between p-4 rounded-lg border hover:border-primary hover:shadow-sm transition-all cursor-pointer"
                onClick={() => onView(lesson)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onView(lesson)
                  }
                }}
              >
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{lesson.title}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline">
                      {lesson.contentType}
                    </Badge>
                    {lesson.timeBased && (
                      <Badge variant="secondary">
                        {lesson.timeBased} minutes
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {lesson.createdAt && (
                      <div className="flex items-center gap-1">
                        Created {new Date(lesson.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {lesson.progress !== undefined && (
                    <div className="mt-2 space-y-1">
                      <Progress value={lesson.progress} className="h-2" />
                      <div className="text-xs text-right text-muted-foreground">
                        {lesson.progress}% complete
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onView(lesson)
                  }}
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