"use client"

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
import { Badge } from "@/components/ui/badge"
import { BarChart, Timer, Trophy, Users } from "lucide-react"

// Temporary mock data
const mockPerformance = {
  overview: {
    lessonsCompleted: 12,
    averageScore: 85,
    totalTimeSpent: "24h 30m",
    ranking: 5
  },
  recentActivity: [
    {
      id: "1",
      lesson: "Customer Service Basics",
      score: 90,
      timeSpent: "45m",
      completedAt: "2024-03-15T10:30:00Z",
      status: "passed"
    },
    {
      id: "2",
      lesson: "Handling Difficult Customers",
      score: 75,
      timeSpent: "1h 15m",
      completedAt: "2024-03-14T15:45:00Z",
      status: "passed"
    },
    {
      id: "3",
      lesson: "Communication Skills",
      score: 65,
      timeSpent: "55m",
      completedAt: "2024-03-13T09:20:00Z",
      status: "failed"
    }
  ]
}

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress and performance in training modules.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lessons Completed
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPerformance.overview.lessonsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Score
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPerformance.overview.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Time Spent
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPerformance.overview.totalTimeSpent}</div>
            <p className="text-xs text-muted-foreground">
              +3h from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ranking
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{mockPerformance.overview.ranking}</div>
            <p className="text-xs text-muted-foreground">
              Top 10% of trainees
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest training sessions and assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lesson</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPerformance.recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.lesson}</TableCell>
                  <TableCell>{activity.score}%</TableCell>
                  <TableCell>{activity.timeSpent}</TableCell>
                  <TableCell>{new Date(activity.completedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={activity.status === "passed" ? "default" : "destructive"}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance by Category</CardTitle>
            <CardDescription>
              Your scores across different training categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Customer Service</div>
                  <div className="text-sm text-muted-foreground">85%</div>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Communication</div>
                  <div className="text-sm text-muted-foreground">75%</div>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: "75%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Problem Solving</div>
                  <div className="text-sm text-muted-foreground">90%</div>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Lessons</CardTitle>
            <CardDescription>
              Recommended lessons based on your performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Advanced Customer Handling</div>
                  <div className="text-sm text-muted-foreground">Estimated time: 1h 30m</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Conflict Resolution</div>
                  <div className="text-sm text-muted-foreground">Estimated time: 2h</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 