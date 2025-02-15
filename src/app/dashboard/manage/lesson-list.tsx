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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Edit, Eye, Users2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUserStore } from "@/lib/store/use-user-store"
import { getAuthHeader } from "@/lib/auth/tokens"
import { Lesson } from "./types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api"

interface LessonListProps {
  lessons: Lesson[]
  isLoading: boolean
  onView: (lesson: Lesson) => void
  onEdit: (lesson: Lesson) => void
  onAssign: (lesson: Lesson) => void
  onDelete?: (lessonId: string) => void
}

export function LessonList({
  lessons,
  isLoading,
  onView,
  onEdit,
  onAssign,
  onDelete,
}: LessonListProps) {
  const { user } = useUserStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null)

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (!lessonToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`${API_URL}/lessons/${lessonToDelete._id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader()
        },
        credentials: 'include',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Lesson deleted successfully"
        })
        onDelete?.(lessonToDelete._id)
      } else {
        const data = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error?.message || "Failed to delete lesson"
        })
      }
    } catch (error) {
      console.error('Error deleting lesson:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete lesson"
      })
    } finally {
      setIsDeleting(false)
      setLessonToDelete(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Lessons</CardTitle>
          <CardDescription>
            View and manage your created lessons
          </CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLessons.map((lesson) => (
                  <TableRow key={lesson._id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{lesson.contentType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{lesson.difficulty}</Badge>
                    </TableCell>
                    <TableCell>{lesson.totalEnrolled}</TableCell>
                    <TableCell>{lesson.averageRating.toFixed(1)}</TableCell>
                    <TableCell>{new Date(lesson.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={lesson.isActive ? "default" : "secondary"}>
                        {lesson.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onView(lesson)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onEdit(lesson)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user?.role === 'trainer' && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onAssign(lesson)}
                          >
                            <Users2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setLessonToDelete(lesson)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!lessonToDelete} onOpenChange={() => setLessonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lesson
              "{lessonToDelete?.title}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 