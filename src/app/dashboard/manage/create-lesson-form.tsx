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
          options: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false }
          ],
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
        options: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false }
        ],
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
    form.setValue(`questions.${questionIndex}.options`, [
      ...question.options,
      { text: "", isCorrect: false }
    ], { shouldValidate: true })
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const questions = form.getValues("questions")
    const question = questions[questionIndex]
    
    // Don't remove if there are only 2 options
    if (question.options.length <= 2) return
    
    // If removing the correct option, set the first remaining option as correct
    const wasCorrect = question.options[optionIndex].isCorrect
    const newOptions = question.options.filter((_, i) => i !== optionIndex)
    
    if (wasCorrect) {
      newOptions[0].isCorrect = true
      form.setValue(`questions.${questionIndex}.correctAnswer`, 0, { shouldValidate: true })
    }
    
    form.setValue(`questions.${questionIndex}.options`, newOptions, { shouldValidate: true })
  }

  const handleSubmit = async (data: LessonFormValues) => {
    try {
      // Transform the data to match the API schema
      const transformedQuestions = data.questions.map(question => ({
        questionText: question.questionText,
        options: question.options.map((option, index) => ({
          text: option.text,
          isCorrect: index === question.correctAnswer
        })),
        correctAnswer: question.correctAnswer
      }))

      const submissionData = {
        title: data.title,
        description: data.description,
        contentType: data.contentType,
        textContent: data.textContent || undefined,
        videoURL: data.videoURL || undefined,
        timeBased: data.timeBased,
        questions: transformedQuestions
      }

      console.log('Submitting data:', submissionData)
      await onSubmit(submissionData)
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
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.options.${optionIndex}.text`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder={`Option ${optionIndex + 1}`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.options.${optionIndex}.isCorrect`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <input
                                  type="radio"
                                  checked={form.watch(`questions.${questionIndex}.correctAnswer`) === optionIndex}
                                  onChange={() => {
                                    // Update correctAnswer
                                    form.setValue(`questions.${questionIndex}.correctAnswer`, optionIndex);
                                    // Update isCorrect flags
                                    const newOptions = question.options.map((opt, idx) => ({
                                      ...opt,
                                      isCorrect: idx === optionIndex
                                    }));
                                    form.setValue(`questions.${questionIndex}.options`, newOptions, { shouldValidate: true });
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
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

        {/* Enhanced Validation Status Display */}
        <div className="mt-4 p-4 border rounded-lg space-y-4 bg-muted">
          <h3 className="font-medium">Form Status:</h3>
          <div className="text-sm space-y-1">
            <p>Form is valid: {form.formState.isValid ? "✅" : "❌"}</p>
            <p>Form is submitting: {form.formState.isSubmitting ? "✅" : "❌"}</p>
            <p>Form is dirty: {form.formState.isDirty ? "✅" : "❌"}</p>
            <p>Fields touched: {Object.keys(form.formState.touchedFields).join(", ") || "none"}</p>
          </div>
          
          {/* Detailed Validation Errors */}
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-destructive">Validation Errors:</h4>
              <div className="space-y-2">
                {Object.entries(form.formState.errors).map(([field, error]) => {
                  // Handle nested errors (like questions array)
                  if (field === 'questions' && error.type === 'array') {
                    return (
                      <div key={field} className="space-y-1">
                        <p className="font-medium">Questions:</p>
                        {(error as any).message}
                        {Array.isArray((error as any).questions) && (error as any).questions.map((qError: any, index: number) => (
                          <div key={index} className="ml-4">
                            <p>Question {index + 1}:</p>
                            <pre className="text-xs bg-destructive/10 p-2 rounded">
                              {JSON.stringify(qError, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div key={field} className="p-2 bg-destructive/10 rounded">
                      <p className="font-medium">{field}:</p>
                      <p className="text-sm text-destructive">{(error as any).message}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current Form Values */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Current Form Values:</h4>
            <pre className="text-xs bg-background p-2 rounded whitespace-pre-wrap">
              {JSON.stringify({
                title: form.watch('title'),
                description: form.watch('description'),
                contentType: form.watch('contentType'),
                textContent: form.watch('textContent'),
                videoURL: form.watch('videoURL'),
                timeBased: form.watch('timeBased'),
                questions: form.watch('questions').map(q => ({
                  questionText: q.questionText,
                  options: q.options,
                  correctAnswer: q.correctAnswer
                }))
              }, null, 2)}
            </pre>
          </div>
        </div>
      </form>
    </Form>
  )
} 