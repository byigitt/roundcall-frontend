"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
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
import { Lesson, LessonFormValues, lessonSchema } from "./types"
import { useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"

interface EditLessonDialogProps {
  lesson: Lesson | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (lessonId: string, data: Partial<LessonFormValues>) => Promise<void>
}

export function EditLessonDialog({
  lesson,
  open,
  onOpenChange,
  onUpdate,
}: EditLessonDialogProps) {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      contentType: "Text",
      textContent: "",
      questions: [{
        questionText: "",
        options: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false }
        ],
        correctAnswer: 0
      }]
    }
  })

  useEffect(() => {
    if (open && lesson) {
      form.reset({
        title: lesson.title,
        description: lesson.description,
        contentType: lesson.contentType as "Text" | "Video" | "Both",
        textContent: lesson.textContent || "",
        questions: lesson.questions || [{
          questionText: "",
          options: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false }
          ],
          correctAnswer: 0
        }]
      })
    }
  }, [open, lesson, form])

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

  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
          <DialogDescription>
            Make changes to the lesson content and details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = form.getValues()
            onUpdate(lesson?.id ?? '', formData)
          }} className="space-y-4">
            <div className="space-y-4">
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
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="textContent"
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

              {/* Questions Section */}
              <div className="space-y-4">
                <Label>Questions</Label>
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
                                    <Input placeholder={`Option ${optionIndex + 1}`} {...field} value={field.value.text} onChange={e => field.onChange({ ...field.value, text: e.target.value })} />
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
              </div>
            </div>
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 