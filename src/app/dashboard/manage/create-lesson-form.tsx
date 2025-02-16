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
      contentType: "Text",
      textContent: "",
      videoURL: "",
      timeBased: undefined,
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
    const timeoutId = setTimeout(() => {
      if (contentType === "Text") {
        form.setValue("videoURL", "", { shouldValidate: true })
      }
      if (contentType === "Video") {
        form.setValue("textContent", "", { shouldValidate: true })
        form.setValue("timeBased", undefined, { shouldValidate: true })
      }
      
      // Trigger validation after changing content type
      form.trigger()
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [contentType, form])

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

      const submissionData = {
        title: data.title,
        description: data.description,
        contentType: data.contentType,
        textContent: data.textContent || undefined,
        videoURL: data.videoURL || undefined,
        timeBased: data.timeBased,
        questions: data.questions
      }
      // Remove undefined values and ensure all required fields are present
      const cleanedData: LessonFormValues = {
        title: submissionData.title,
        description: submissionData.description,
        contentType: submissionData.contentType,
        questions: submissionData.questions,
        ...(submissionData.textContent && { textContent: submissionData.textContent }),
        ...(submissionData.videoURL && { videoURL: submissionData.videoURL }),
        ...(submissionData.timeBased && { timeBased: submissionData.timeBased })
      }

      await onSubmit(cleanedData)
      
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
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="Text"
                          value="Text"
                          checked={field.value === "Text"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Label htmlFor="Text">Text</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="Video"
                          value="Video"
                          checked={field.value === "Video"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Label htmlFor="Video">Video</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="Both"
                          value="Both"
                          checked={field.value === "Both"}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <Label htmlFor="Both">Both</Label>
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
            {(contentType === "Text" || contentType === "Both") && (
              <>
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

                <FormField
                  control={form.control}
                  name="timeBased"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Limit (minutes)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Timer className="h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min={1}
                            max={180}
                            placeholder="Optional"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            value={field.value || ''}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Optional: Set a time limit for reading the content (1-180 minutes)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {(contentType === "Video" || contentType === "Both") && (
              <FormField
                control={form.control}
                name="videoURL"
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>
              Add questions to the lesson.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Questions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Questions</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {form.watch("questions").map((question, questionIndex) => (
                <div key={questionIndex} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name={`questions.${questionIndex}.questionText`}
                      render={({ field }) => (
                        <FormItem className="flex-1 mr-4">
                          <FormLabel>Question {questionIndex + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter question" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(questionIndex)}
                      disabled={form.watch("questions").length <= 1}
                      className="self-end"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((_, optionIndex) => (
                      <FormField
                        key={optionIndex}
                        control={form.control}
                        name={`questions.${questionIndex}.options.${optionIndex}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input placeholder={`Option ${optionIndex + 1}`} {...field} />
                                <input
                                  type="radio"
                                  checked={form.watch(`questions.${questionIndex}.correctAnswer`) === optionIndex}
                                  onChange={() => form.setValue(`questions.${questionIndex}.correctAnswer`, optionIndex)}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(questionIndex, optionIndex)}
                                  disabled={question.options.length <= 2}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(questionIndex)}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Option
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isPending || !form.formState.isValid}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Creating..." : "Create Lesson"}
        </Button>

        {/* Validation Status Display */}
        <div className="mt-4 p-4 border rounded-lg space-y-2 bg-muted">
          <h3 className="font-medium">Form Status:</h3>
          <div className="text-sm space-y-1">
            <p>Form is valid: {form.formState.isValid ? "✅" : "❌"}</p>
            <p>Form is submitting: {form.formState.isSubmitting ? "✅" : "❌"}</p>
            <p>Form is dirty: {form.formState.isDirty ? "✅" : "❌"}</p>
          </div>
          
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-destructive">Validation Errors:</h4>
              <pre className="mt-2 p-2 bg-destructive/10 rounded text-xs whitespace-pre-wrap">
                {JSON.stringify(form.formState.errors, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </form>
    </Form>
  )
} 