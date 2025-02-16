import * as z from "zod"

export const lessonSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z.string()
    .min(50, "Description must be at least 50 characters"),
  contentType: z.enum(["Text", "Video", "Both"]),
  textContent: z.string().optional(),
  videoURL: z.string().optional(),
  timeBased: z.number().min(1).max(180).optional(),
  questions: z.array(z.object({
    questionText: z.string().min(1, "Question text is required"),
    options: z.array(z.string().min(1, "Option text is required")).min(2, "At least 2 options are required"),
    correctAnswer: z.number()
  }))
}).refine((data) => {
  if (data.contentType === "Text" || data.contentType === "Both") {
    return !!data.textContent;
  }
  return true;
}, {
  message: "Text content is required for Text or Both content types",
  path: ["textContent"]
}).refine((data) => {
  if (data.contentType === "Video" || data.contentType === "Both") {
    return data.videoURL && z.string().url().safeParse(data.videoURL).success;
  }
  return true;
}, {
  message: "Please enter a valid URL for Video content",
  path: ["videoURL"]
})

export type LessonFormValues = z.infer<typeof lessonSchema>

export interface Lesson {
  _id: string;
  id?: string;  // Keep for backward compatibility
  title: string;
  description: string;
  contentType: string;
  textContent: string;
  videoURL?: string;
  timeBased?: number;
  questions: Question[];
  createdAt: string;
  createdBy: string;
}

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

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Trainee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
} 