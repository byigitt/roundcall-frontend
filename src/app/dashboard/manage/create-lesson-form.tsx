"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Trash2, Timer } from "lucide-react"
import { LessonFormValues, lessonSchema } from "./types"

interface CreateLessonFormProps {
  onSubmit: (data: LessonFormValues) => Promise<void>
  isPending: boolean
}

export function CreateLessonForm({ onSubmit, isPending }: CreateLessonFormProps) {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      contentType: "text",
      textContent: "",
      videoUrl: "",
      duration: 0,
      displayTime: 10000, // 10 seconds default
      difficulty: "beginner",
      tags: [],
      questions: [
        {
          questionText: "",
          options: ["", ""],
          correctAnswer: 0
        }
      ]
    }
  })

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

  const contentType = form.watch("contentType")

  return (
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter lesson description"
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
            <CardTitle>Content Type</CardTitle>
            <CardDescription>
              Select the content type for this lesson.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="contentType"
                          value="text"
                          checked={field.value === "text"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Label>Regular Text</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="contentType"
                          value="timed_text"
                          checked={field.value === "timed_text"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Label>Timed Text</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="contentType"
                          value="video"
                          checked={field.value === "video"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Label>Video</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="contentType"
                          value="both"
                          checked={field.value === "both"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Label>Both</Label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>
              Enter the content for this lesson.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(contentType === "text" || contentType === "timed_text" || contentType === "both") && (
              <FormField
                control={form.control}
                name="textContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Content</FormLabel>
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
            )}

            {contentType === "timed_text" && (
              <FormField
                control={form.control}
                name="displayTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Time (seconds)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min={5}
                          max={300}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value) * 1000)} // Convert to milliseconds
                          value={field.value ? field.value / 1000 : ''} // Convert from milliseconds
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Time in seconds before the content is hidden (5-300 seconds)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(contentType === "video" || contentType === "both") && (
              <>
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter video URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Duration (seconds)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Enter video duration in seconds"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Difficulty</CardTitle>
            <CardDescription>
              Select the difficulty level for this lesson.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="difficulty"
                        value="beginner"
                        checked={field.value === "beginner"}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <Label>Beginner</Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="difficulty"
                        value="intermediate"
                        checked={field.value === "intermediate"}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <Label>Intermediate</Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="difficulty"
                        value="advanced"
                        checked={field.value === "advanced"}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <Label>Advanced</Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Add tags to help categorize this lesson.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {form.watch("tags").map((tag, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`tags.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tag" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => form.setValue("tags", [...form.getValues("tags"), ""])}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
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
  )
} 