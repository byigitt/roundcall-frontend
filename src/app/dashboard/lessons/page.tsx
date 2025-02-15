"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Lesson, getLessons, deleteLesson } from "@/lib/services/lesson-service"

export default function LessonsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    setLoading(true)
    try {
      const response = await getLessons()
      if (response.status === "success" && response.data) {
        setLessons(response.data.lessons)
      } else {
        toast({
          title: "Error",
          description: response.error?.message || "Failed to fetch lessons",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteLesson(id)
      if (response.status === "success") {
        toast({
          title: "Success",
          description: "Lesson deleted successfully",
        })
        fetchLessons()
      } else {
        toast({
          title: "Error",
          description: response.error?.message || "Failed to delete lesson",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }: { row: any }) => {
        return new Date(row.original.createdAt).toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const lesson = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/lessons/${lesson.id}`)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/lessons/${lesson.id}/edit`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(lesson.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
        <p className="text-muted-foreground">
          Create and manage your training lessons
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Lessons</CardTitle>
              <CardDescription>
                A list of all lessons in your training program
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/dashboard/lessons/create")}
              className="ml-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Lesson
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <DataTable
            columns={columns}
            data={filteredLessons}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  )
} 