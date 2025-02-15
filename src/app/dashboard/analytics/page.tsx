"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LineChart, BarChart, Users2, Brain, Search, Download } from "lucide-react"
import { useUserStore } from "@/lib/store/use-user-store"

// Temporary mock data - replace with actual API calls
const mockTrainees = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    department: "Sales",
    lessonsCompleted: 8,
    averageScore: 85,
    lastActive: "2024-03-15T10:30:00Z",
    status: "active"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    department: "Support",
    lessonsCompleted: 12,
    averageScore: 92,
    lastActive: "2024-03-15T09:15:00Z",
    status: "active"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    department: "Sales",
    lessonsCompleted: 5,
    averageScore: 78,
    lastActive: "2024-03-14T15:45:00Z",
    status: "inactive"
  }
]

const mockLessons = [
  {
    id: "1",
    title: "Customer Service Basics",
    completionRate: 85,
    averageScore: 88,
    totalAttempts: 45
  },
  {
    id: "2",
    title: "Handling Difficult Customers",
    completionRate: 75,
    averageScore: 82,
    totalAttempts: 38
  },
  {
    id: "3",
    title: "Communication Skills",
    completionRate: 92,
    averageScore: 90,
    totalAttempts: 52
  }
]

export default function AnalyticsPage() {
  const { user } = useUserStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const filteredTrainees = mockTrainees.filter(trainee => {
    const matchesSearch = trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || trainee.department.toLowerCase() === departmentFilter
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and analyze trainee performance and lesson effectiveness.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Trainees
            </CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTrainees.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockTrainees.filter(t => t.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Completion Rate
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockLessons.reduce((acc, lesson) => acc + lesson.completionRate, 0) / mockLessons.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all lessons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Score
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockTrainees.reduce((acc, trainee) => acc + trainee.averageScore, 0) / mockTrainees.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              All trainees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Lessons
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLessons.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockLessons.reduce((acc, lesson) => acc + lesson.totalAttempts, 0)} total attempts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trainee List */}
      <Card>
        <CardHeader>
          <CardTitle>Trainee Performance</CardTitle>
          <CardDescription>
            Detailed view of individual trainee progress and performance
          </CardDescription>
          <div className="flex items-center space-x-2 mt-4">
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
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Lessons Completed</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainees.map((trainee) => (
                <TableRow key={trainee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{trainee.name}</div>
                      <div className="text-sm text-muted-foreground">{trainee.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{trainee.department}</TableCell>
                  <TableCell>{trainee.lessonsCompleted}</TableCell>
                  <TableCell>{trainee.averageScore}%</TableCell>
                  <TableCell>{new Date(trainee.lastActive).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={trainee.status === "active" ? "default" : "secondary"}>
                      {trainee.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lesson Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Analytics</CardTitle>
          <CardDescription>
            Performance metrics for each lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lesson Title</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>Total Attempts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{lesson.completionRate}%</TableCell>
                  <TableCell>{lesson.averageScore}%</TableCell>
                  <TableCell>{lesson.totalAttempts}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 