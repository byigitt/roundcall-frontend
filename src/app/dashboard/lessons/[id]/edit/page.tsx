"use client"

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Lesson,
  lessonSchema,
  getLesson,
  updateLesson,
} from "@/lib/services/lesson-service"

interface EditLessonPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditLessonPage(props: EditLessonPageProps) {
  const params = use(props.params);
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<Lesson>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      content: "",
      videoUrl: "",
      category: "",
    },
  })

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await getLesson(params.id)
        if (response.status === "success" && response.data?.lesson) {
          const lesson = response.data.lesson
          form.reset({
            title: lesson.title,
            content: lesson.content,
            videoUrl: lesson.videoUrl || "",
            category: lesson.category || "",
          })
        } else {
          toast({
            title: "Error",
            description: response.error?.message || "Failed to fetch lesson",
            variant: "destructive",
          })
          router.push("/dashboard/lessons")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
        router.push("/dashboard/lessons")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLesson()
  }, [params.id, form, router, toast])

  const onSubmit = async (data: Lesson) => {
    setIsSubmitting(true)
    try {
      const response = await updateLesson(params.id, data)
      if (response.status === "success") {
        toast({
          title: "Success",
          description: "Lesson updated successfully",
        })
        router.push("/dashboard/lessons")
      } else {
        toast({
          title: "Error",
          description: response.error?.message || "Failed to update lesson",
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
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-[400px]">
              Loading...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Lesson</CardTitle>
          <CardDescription>
            Update the lesson content and properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lesson title" {...field} />
                    </FormControl>
                    <FormDescription>
                      The title should be between 5 and 200 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lesson category" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional category for organizing lessons
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter lesson content"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The content should be at least 50 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter video URL" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional video URL for the lesson
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/lessons")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 