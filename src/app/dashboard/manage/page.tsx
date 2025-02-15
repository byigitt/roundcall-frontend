"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"

const lessonSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  questions: z.array(z.object({
    questionText: z.string().min(10, "Question must be at least 10 characters"),
    options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options required"),
    correctAnswer: z.number().min(0)
  }))
})

type LessonFormValues = z.infer<typeof lessonSchema>

export default function ManagePage() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      content: "",
      questions: [
        {
          questionText: "",
          options: ["", ""],
          correctAnswer: 0
        }
      ]
    }
  })

  function onSubmit(data: LessonFormValues) {
    startTransition(async () => {
      try {
        // TODO: Implement API call
        console.log(data)
        toast({
          title: "Success",
          description: "Lesson created successfully",
        })
        form.reset()
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create lesson. Please try again.",
        })
      }
    })
  }

  const addQuestion = () => {
    const questions = form.getValues("questions")
    form.setValue("questions", [
      ...questions,
      {
        questionText: "",
        options: ["", ""],
        correctAnswer: 0
      }
    ])
  }

  const removeQuestion = (index: number) => {
    const questions = form.getValues("questions")
    form.setValue("questions", questions.filter((_, i) => i !== index))
  }

  const addOption = (questionIndex: number) => {
    const questions = form.getValues("questions")
    const question = questions[questionIndex]
    form.setValue(`questions.${questionIndex}.options`, [...question.options, ""])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Content</h1>
        <p className="text-muted-foreground">
          Create and manage lessons and questions for your training program.
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Lesson</TabsTrigger>
          <TabsTrigger value="view">View Lessons</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Details</CardTitle>
                  <CardDescription>
                    Enter the basic information about your lesson.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter lesson title" {...field} />
                        </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Questions</CardTitle>
                  <CardDescription>
                    Add multiple-choice questions for this lesson.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {form.watch("questions").map((question, questionIndex) => (
                    <div key={questionIndex} className="space-y-4 p-4 border rounded-lg relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => removeQuestion(questionIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.questionText`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question {questionIndex + 1}</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your question" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <Label>Options</Label>
                        {question.options.map((_, optionIndex) => (
                          <FormField
                            key={optionIndex}
                            control={form.control}
                            name={`questions.${questionIndex}.options.${optionIndex}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Input placeholder={`Option ${optionIndex + 1}`} {...field} />
                                    <input
                                      type="radio"
                                      name={`correctAnswer-${questionIndex}`}
                                      checked={form.watch(`questions.${questionIndex}.correctAnswer`) === optionIndex}
                                      onChange={() => form.setValue(`questions.${questionIndex}.correctAnswer`, optionIndex)}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(questionIndex)}
                        >
                          Add Option
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addQuestion}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Lesson
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Your Lessons</CardTitle>
              <CardDescription>
                View and manage your existing lessons.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No lessons created yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 