import { getAuthHeader } from "@/lib/auth/tokens"
import * as z from "zod"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

// Validation schemas
export const lessonSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z.string()
    .min(50, "Description must be at least 50 characters"),
  contentType: z.enum(["Text", "Video", "Both"]),
  textContent: z.string().optional(),
  videoURL: z.string().url().optional(),
  timeBased: z.number().optional() // time limit in minutes
})

export const questionSchema = z.object({
  lessonID: z.string(),
  questionText: z.string(),
  options: z.record(z.string()),
  correctAnswer: z.string(),
  timeLimit: z.number().optional()
})

export type ContentType = "Text" | "Video" | "Both"
export type LessonStatus = "Assigned" | "In Progress" | "Completed" | "Expired"

export interface QuestionOption {
  text: string
  isCorrect: boolean
}

export interface Question {
  text: string
  options: Array<string | { text: string; isCorrect: boolean }>
}

export interface LessonContent {
  id: string
  title: string
  description: string
  contentType: ContentType
  textContent?: string
  videoURL?: string
  timeBased?: number
  questions: Question[]
  createdAt: string
  createdBy: string
}

export interface Lesson extends LessonContent {
  _id: string
  status?: LessonStatus
  assignedAt?: string
}

export interface AssignedLesson {
  id: string
  lessonID: string
  traineeID: string
  trainerID: string
  status: LessonStatus
  startedAt: string | null
  completedAt: string | null
  assignedAt: string
  progress: number
  lesson?: LessonContent
}

export interface Trainee {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface LessonAssignment {
  id: string
  lessonID: string
  traineeID: string
  trainerID: string
  status: LessonStatus
  startedAt: string | null
  completedAt: string | null
  assignedAt: string
  progress: number
  lesson: LessonContent
  trainee: Trainee
}

// API Functions
export async function createLesson(lesson: Lesson): Promise<{ id: string } | { detail: string }> {
  try {
    const response = await fetch(`${API_URL}/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      credentials: 'include',
      body: JSON.stringify({
        title: lesson.title,
        description: lesson.description,
        contentType: lesson.contentType,
        textContent: lesson.textContent,
        videoURL: lesson.videoURL,
        timeBased: lesson.timeBased
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return { detail: error.detail || "Failed to create lesson" }
    }

    return await response.json()
  } catch (error) {
    return { detail: "Failed to connect to the server" }
  }
}

export async function getLessons(): Promise<Lesson[] | { detail: string }> {
  try {
    const response = await fetch(`${API_URL}/lessons`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      const error = await response.json()
      return { detail: error.detail || "Failed to fetch lessons" }
    }

    return await response.json()
  } catch (error) {
    return { detail: "Failed to connect to the server" }
  }
}

export async function getLesson(id: string): Promise<Lesson | { detail: string }> {
  try {
    const response = await fetch(`${API_URL}/lessons/${id}`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      const error = await response.json()
      return { detail: error.detail || "Failed to fetch lesson" }
    }

    return await response.json()
  } catch (error) {
    return { detail: "Failed to connect to the server" }
  }
}

export async function updateLessonStatus(lessonId: string, status: LessonStatus): Promise<{ message: string } | { detail: string }> {
  try {
    const response = await fetch(`${API_URL}/lessons/${lessonId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { detail: error.detail || "Failed to update lesson status" }
    }

    return await response.json()
  } catch (error) {
    return { detail: "Failed to connect to the server" }
  }
}

// Question Management
export async function createQuestion(question: Question): Promise<{ id: string } | { detail: string }> {
  try {
    const response = await fetch(`${API_URL}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(question),
    })

    if (!response.ok) {
      const error = await response.json()
      return { detail: error.detail || "Failed to create question" }
    }

    return await response.json()
  } catch (error) {
    return { detail: "Failed to connect to the server" }
  }
}

export async function getLessonQuestions(lessonId: string): Promise<Question[] | { detail: string }> {
  try {
    const response = await fetch(`${API_URL}/questions/lesson/${lessonId}`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      const error = await response.json()
      return { detail: error.detail || "Failed to fetch questions" }
    }

    return await response.json()
  } catch (error) {
    return { detail: "Failed to connect to the server" }
  }
}

export async function answerQuestion(questionId: string, answer: { selectedAnswer: string, responseTime: number }): Promise<{ isCorrect: boolean, selectedAnswer: string, correctAnswer: string } | { detail: string }> {
  try {
    const response = await fetch(`${API_URL}/questions/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        questionID: questionId,
        ...answer
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { detail: error.detail || "Failed to submit answer" }
    }

    return await response.json()
  } catch (error) {
    return { detail: "Failed to connect to the server" }
  }
}

// Analytics
export async function getLessonAnalytics(lessonId: string): Promise<any | { detail: string }> {
  try {
    const response = await fetch(`${API_URL}/analytics/lesson/${lessonId}`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      const error = await response.json()
      return { detail: error.detail || "Failed to fetch analytics" }
    }

    return await response.json()
  } catch (error) {
    return { detail: "Failed to connect to the server" }
  }
}

export async function getTraineeAnalytics(traineeId: string): Promise<any | { detail: string }> {
  try {
    const response = await fetch(`${API_URL}/analytics/trainee/${traineeId}`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      const error = await response.json()
      return { detail: error.detail || "Failed to fetch trainee analytics" }
    }

    return await response.json()
  } catch (error) {
    return { detail: "Failed to connect to the server" }
  }
} 