"use client"

import { useState, useEffect } from "react"
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
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      contentType: "text",
      textContent: "",
      videoUrl: "",
      duration: 0,
      displayTime: 10000,
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

  const contentType = form.watch("contentType")

  // Reset dependent fields when content type changes
  useEffect(() => {
    if (contentType === "text" || contentType === "timed_text") {
      form.setValue("videoUrl", "", { shouldValidate: true })
      form.setValue("duration", 0, { shouldValidate: true })
    }
    if (contentType !== "timed_text") {
      form.setValue("displayTime", 10000, { shouldValidate: true })
    }
    if (contentType === "video") {
      form.setValue("textContent", "", { shouldValidate: true })
    }
    
    // Trigger validation after changing content type
    form.trigger()
  }, [contentType, form])

  // Add debug information with more details
  const formState = form.formState
  const values = form.getValues()
  console.log('Form Values:', values)
  console.log('Form Errors:', formState.errors)
  console.log('Is Form Valid:', formState.isValid)
  console.log('Is Form Submitting:', formState.isSubmitting)
  console.log('Is Form Dirty:', formState.isDirty)
  console.log('Form State:', {
    isValidating: formState.isValidating,
    isSubmitted: formState.isSubmitted,
    submitCount: formState.submitCount,
    touchedFields: formState.touchedFields,
    dirtyFields: formState.dirtyFields
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
    ], { shouldValidate: true })
  }

  const removeQuestion = (index: number) => {
    const questions = form.getValues("questions")
    if (questions.length <= 1) return // Don't remove if it's the last question
    form.setValue("questions", questions.filter((_, i) => i !== index), { shouldValidate: true })
  }

  const addOption = (questionIndex: number) => {
    const questions = form.getValues("questions")
    const question = questions[questionIndex]
    form.setValue(`questions.${questionIndex}.options`, [...question.options, ""], { shouldValidate: true })
  }

  const removeTag = (index: number) => {
    const tags = form.getValues("tags")
    form.setValue("tags", tags.filter((_, i) => i !== index), { shouldValidate: true })
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const questions = form.getValues("questions")
    const question = questions[questionIndex]
    
    // Don't remove if there are only 2 options
    if (question.options.length <= 2) return
    
    // If removing the correct answer, set it to the first option
    if (question.correctAnswer === optionIndex) {
      form.setValue(`questions.${questionIndex}.correctAnswer`, 0, { shouldValidate: true })
    }
    // If removing an option before the correct answer, adjust the correct answer index
    else if (optionIndex < question.correctAnswer) {
      form.setValue(`questions.${questionIndex}.correctAnswer`, question.correctAnswer - 1, { shouldValidate: true })
    }
    
    const newOptions = question.options.filter((_, i) => i !== optionIndex)
    form.setValue(`questions.${questionIndex}.options`, newOptions, { shouldValidate: true })
  }

  const handleSubmit = async (data: LessonFormValues) => {
    try {
      // Log the data being submitted
      console.log('Submitting data:', data)

      const submissionData = { ...data } as Partial<LessonFormValues>

      // Remove videoUrl and duration if not needed
      if (data.contentType === "text" || data.contentType === "timed_text") {
        delete submissionData.videoUrl
        delete submissionData.duration
      }

      // Remove displayTime if not needed
      if (data.contentType !== "timed_text") {
        delete submissionData.displayTime
      }

      // Filter out empty tags
      submissionData.tags = data.tags.filter(tag => tag.trim() !== "")

      await onSubmit(submissionData as LessonFormValues)
      
      // Reset form after successful submission
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                          id="text"
                          value="text"
                          checked={field.value === "text"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Label htmlFor="text">Regular Text</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="timed_text"
                          value="timed_text"
                          checked={field.value === "timed_text"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Label htmlFor="timed_text">Timed Text</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="video"
                          value="video"
                          checked={field.value === "video"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Label htmlFor="video">Video</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="both"
                          value="both"
                          checked={field.value === "both"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Label htmlFor="both">Both</Label>
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
                    <FormDescription>
                      Content must be at least 50 characters. Current length: {field.value.length}
                    </FormDescription>
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
                      <div className="flex items-center gap-2">
                        <Input placeholder="Enter tag" {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTag(index)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
                            <div className="flex items-center gap-2">
                              <div className="flex items-center space-x-2 flex-1">
                                <Input placeholder={`Option ${optionIndex + 1}`} {...field} />
                                <input
                                  type="radio"
                                  name={`correctAnswer-${questionIndex}`}
                                  checked={form.watch(`questions.${questionIndex}.correctAnswer`) === optionIndex}
                                  onChange={() => form.setValue(`questions.${questionIndex}.correctAnswer`, optionIndex)}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(questionIndex, optionIndex)}
                                className="h-8 w-8"
                                disabled={question.options.length <= 2}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isPending || !formState.isValid || formState.isSubmitting}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Creating..." : "Create Lesson"}
        </Button>
      </form>
    </Form>
  )
} 