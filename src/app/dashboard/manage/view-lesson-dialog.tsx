"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Users, Star, BookOpen, BarChart } from "lucide-react"
import { Lesson } from "./types"

interface ViewLessonDialogProps {
  lesson: Lesson | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewLessonDialog({
  lesson,
  open,
  onOpenChange,
}: ViewLessonDialogProps) {
  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{lesson.title}</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Created on {new Date(lesson.createdAt).toLocaleDateString()}
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
          <div className="space-y-6">
            {/* Description Section */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Description</h4>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground break-all hyphens-auto overflow-wrap-break-word">
                  {lesson.description}
                </p>
              </div>
            </div>

            <Separator />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">Content Type</span>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {lesson.contentType}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Content Section */}
            {lesson.textContent && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">Content</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {lesson.textContent}
                  </p>
                </div>
              </div>
            )}


            {/* Questions Section */}
            {lesson.questions && lesson.questions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Questions</h4>
                {lesson.questions.map((question, index) => (
                  <div key={index} className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="font-medium">{index + 1}. {question.questionText}</p>
                    <div className="ml-4 space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <Badge variant={optionIndex === question.correctAnswer ? "default" : "outline"} className="w-6 h-6 flex items-center justify-center p-0">
                            {String.fromCharCode(65 + optionIndex)}
                          </Badge>
                          <span className="text-sm">{option.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 