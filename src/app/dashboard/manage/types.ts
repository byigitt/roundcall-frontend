import * as z from "zod"

export const lessonSchema = z.object({
  title: z.string().min(5, "Title must be between 5 and 200 characters"),
  description: z.string().min(20, "Description must be between 20 and 1000 characters"),
  contentType: z.enum(["text", "timed_text", "video", "both"]),
  textContent: z.string().min(50, "Content must be at least 50 characters"),
  videoUrl: z.string().url("Invalid video URL").optional(),
  duration: z.number().optional(), // in seconds for video content
  displayTime: z.number().min(5000).max(300000).optional(), // 5-300 seconds in milliseconds
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  tags: z.array(z.string()),
  questions: z.array(
    z.object({
      questionText: z.string().min(10, "Question must be at least 10 characters"),
      options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options required"),
      correctAnswer: z.number().min(0)
    })
  ).min(1, "At least one question is required")
})

export type LessonFormValues = z.infer<typeof lessonSchema>

export type Question = {
  questionText: string
  options: string[]
  correctAnswer: number
}

export type TimerSettings = {
  enabled: boolean
  duration?: number
  hideContentAfterTimer: boolean
}

export interface Lesson {
  _id: string
  title: string
  description: string
  contentType: "text" | "timed_text" | "video" | "both"
  textContent?: string
  videoUrl?: string
  duration?: number
  displayTime?: number
  difficulty: "beginner" | "intermediate" | "advanced"
  totalEnrolled: number
  averageRating: number
  createdAt: string
  updatedAt: string
  isActive: boolean
  tags?: string[]
  questions?: Question[]
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
} 