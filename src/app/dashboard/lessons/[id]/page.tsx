"use client"

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pencil, Plus, ArrowLeft } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Lesson,
  Question,
  getLesson,
  questionSchema,
  addQuestion,
} from "@/lib/services/lesson-service"

interface LessonPageProps {
  params: Promise<{
    id: string
  }>
}

export default function LessonPage(props: LessonPageProps) {
  const params = use(props.params);
  const router = useRouter()
  const { toast } = useToast()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)

  const questionForm = useForm<Question>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
      type: "multipleChoice",
      options: ["", ""],
      correctAnswer: "",
      difficulty: "medium",
      points: 10,
    },
  })

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await getLesson(params.id)
        if (response.status === "success" && response.data?.lesson) {
          setLesson(response.data.lesson)
          // In a real app, we would also fetch questions here
          // setQuestions(response.data.lesson.questions)
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
  }, [params.id, router, toast])

  const onSubmitQuestion = async (data: Question) => {
    setIsSubmitting(true)
    try {
      const response = await addQuestion(params.id, data)
      if (response.status === "success") {
        toast({
          title: "Success",
          description: "Question added successfully",
        })
        setIsAddQuestionOpen(false)
        questionForm.reset()
        // In a real app, we would fetch updated questions here
        // fetchQuestions()
      } else {
        toast({
          title: "Error",
          description: response.error?.message || "Failed to add question",
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

  const questionColumns = [
    {
      accessorKey: "text",
      header: "Question",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
    },
    {
      accessorKey: "points",
      header: "Points",
    },
  ]

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

  if (!lesson) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/lessons")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lessons
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{lesson.title}</CardTitle>
                {lesson.category && (
                  <CardDescription>Category: {lesson.category}</CardDescription>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/dashboard/lessons/${params.id}/edit`)
                }
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit Lesson
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="mt-4">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{lesson.content}</div>
                  {lesson.videoUrl && (
                    <div className="mt-4">
                      <h3>Video Resource</h3>
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {lesson.videoUrl}
                      </a>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="questions" className="mt-4">
                <div className="mb-4">
                  <Dialog
                    open={isAddQuestionOpen}
                    onOpenChange={setIsAddQuestionOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add Question</DialogTitle>
                        <DialogDescription>
                          Create a new question for this lesson
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...questionForm}>
                        <form
                          onSubmit={questionForm.handleSubmit(onSubmitQuestion)}
                          className="space-y-6"
                        >
                          <FormField
                            control={questionForm.control}
                            name="text"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question Text</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Enter question text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  The question should be at least 10 characters
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={questionForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select question type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="multipleChoice">
                                      Multiple Choice
                                    </SelectItem>
                                    <SelectItem value="textRecall">
                                      Text Recall
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={questionForm.control}
                            name="difficulty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Difficulty</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={questionForm.control}
                            name="points"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Points</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Points value between 1 and 100
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end space-x-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsAddQuestionOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? "Adding..." : "Add Question"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                <DataTable
                  columns={questionColumns}
                  data={questions}
                  loading={false}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 