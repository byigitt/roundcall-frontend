"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Loader2, Search, Eye, Clock, HourglassIcon, Timer, CheckCircle2, AlertCircle, BarChart2, Video, CalendarDays, User, CheckCircle, PlayCircle } from "lucide-react"
import { AssignedLesson, LessonStatus, Question, ContentType } from "@/lib/services/lesson-service"
import { formatDistanceToNow } from "date-fns"
import { ArrowRight, BookOpen } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface LessonListProps {
  lessons: AssignedLesson[]
  isLoading: boolean
  onView: (lesson: AssignedLesson) => void
}

const getStatusColor = (status: LessonStatus) => {
  switch (status) {
    case "Completed":
      return "bg-green-500"
    case "In Progress":
      return "bg-blue-500"
    case "Assigned":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusIcon = (status: LessonStatus) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="h-4 w-4" />
    case "In Progress":
      return <PlayCircle className="h-4 w-4" />
    case "Assigned":
      return <Clock className="h-4 w-4" />
    default:
      return null
  }
}

const getContentTypeIcon = (contentType: string) => {
  switch (contentType.toLowerCase()) {
    case "text":
      return <BookOpen className="h-4 w-4" />
    case "video":
      return <PlayCircle className="h-4 w-4" />
    case "both":
      return (
        <div className="flex space-x-1">
          <BookOpen className="h-4 w-4" />
          <PlayCircle className="h-4 w-4" />
        </div>
      )
    default:
      return null
  }
}

export function LessonList({
  lessons,
  isLoading,
  onView,
}: LessonListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<LessonStatus | "all">("all")

  console.log("Original lessons:", lessons);
  const filteredLessons = lessons.filter(assignment => {
    console.log("Checking assignment:", assignment);
    console.log("Search term:", searchTerm);
    console.log("Status filter:", statusFilter);
    
    // Only filter by search if there is a search term
    const matchesSearch = searchTerm === "" ? true :
      assignment.lesson?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.lesson?.description?.toLowerCase().includes(searchTerm.toLowerCase());

    console.log("Matches search:", matchesSearch);
    console.log("Current status:", assignment.status);

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && assignment.status === statusFilter;
  })

  console.log("Filtered lessons:", filteredLessons);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!lessons.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Lessons Found</CardTitle>
          <CardDescription>You have no assigned lessons at the moment.</CardDescription>
        </CardHeader>
      </Card>
    )
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="line-clamp-1">{lesson.lesson?.title}</CardTitle>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(lesson.status)} text-white`}
                  >
                    <span className="flex items-center space-x-1">
                      {getStatusIcon(lesson.status)}
                      <span>{lesson.status}</span>
                    </span>
                  </Badge>
                </div>
                <CardDescription className="flex items-center space-x-2">
                  {lesson.lesson?.contentType && (
                    <span className="flex items-center space-x-1">
                      {getContentTypeIcon(lesson.lesson.contentType)}
                      <span>{lesson.lesson.contentType}</span>
                    </span>
                  )}
                  {lesson.assignedAt && (
                    <span className="text-sm text-muted-foreground">
                      • Assigned {formatDistanceToNow(new Date(lesson.assignedAt))} ago
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {lesson.lesson?.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => onView(lesson)}
                  variant={lesson.status === "Completed" ? "secondary" : "default"}
                  disabled={lesson.status === "Completed"}
                >
                  <span className="flex items-center space-x-2">
                    {lesson.status === "Completed" ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 