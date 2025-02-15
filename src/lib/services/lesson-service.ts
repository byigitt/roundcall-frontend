import { getAuthHeader } from "@/lib/auth/tokens"
import * as z from "zod"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Validation schemas
export const lessonSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters"),
  content: z.string()
    .min(50, "Content must be at least 50 characters"),
  videoUrl: z.string().url().optional(),
  category: z.string().optional(),
})

export const questionSchema = z.object({
  text: z.string().min(10, "Question must be at least 10 characters"),
  type: z.enum(["multipleChoice", "textRecall"]),
  options: z.array(z.string()).min(2, "At least 2 options required").optional(),
  correctAnswer: z.union([z.string(), z.number()]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  points: z.number().min(1).max(100),
})

// Types
export type Lesson = z.infer<typeof lessonSchema>
export type Question = z.infer<typeof questionSchema>

interface ApiResponse<T> {
  status: "success" | "error"
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

// API Functions
export async function createLesson(lesson: Lesson): Promise<ApiResponse<{ lesson: Lesson }>> {
  try {
    const response = await fetch(`${API_URL}/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(lesson),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: {
          code: data.error?.code || "LESSON_001",
          message: data.error?.message || "Failed to create lesson",
        },
      }
    }

    return data
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "SYS_001",
        message: "Failed to connect to the server",
      },
    }
  }
}

export async function getLessons(params?: {
  page?: number
  limit?: number
  search?: string
  category?: string
  sort?: string
}): Promise<ApiResponse<{ lessons: Lesson[] }>> {
  try {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString())
      })
    }

    const response = await fetch(
      `${API_URL}/lessons?${queryParams.toString()}`,
      {
        headers: getAuthHeader(),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: {
          code: data.error?.code || "LESSON_002",
          message: data.error?.message || "Failed to fetch lessons",
        },
      }
    }

    return data
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "SYS_001",
        message: "Failed to connect to the server",
      },
    }
  }
}

export async function getLesson(id: string): Promise<ApiResponse<{ lesson: Lesson }>> {
  try {
    const response = await fetch(`${API_URL}/lessons/${id}`, {
      headers: getAuthHeader(),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: {
          code: data.error?.code || "LESSON_003",
          message: data.error?.message || "Failed to fetch lesson",
        },
      }
    }

    return data
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "SYS_001",
        message: "Failed to connect to the server",
      },
    }
  }
}

export async function updateLesson(
  id: string,
  lesson: Partial<Lesson>
): Promise<ApiResponse<{ lesson: Lesson }>> {
  try {
    const response = await fetch(`${API_URL}/lessons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(lesson),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: {
          code: data.error?.code || "LESSON_004",
          message: data.error?.message || "Failed to update lesson",
        },
      }
    }

    return data
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "SYS_001",
        message: "Failed to connect to the server",
      },
    }
  }
}

export async function deleteLesson(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_URL}/lessons/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: {
          code: data.error?.code || "LESSON_005",
          message: data.error?.message || "Failed to delete lesson",
        },
      }
    }

    return data
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "SYS_001",
        message: "Failed to connect to the server",
      },
    }
  }
}

// Question Management
export async function addQuestion(
  lessonId: string,
  question: Question
): Promise<ApiResponse<{ question: Question }>> {
  try {
    const response = await fetch(`${API_URL}/lessons/${lessonId}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(question),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: {
          code: data.error?.code || "QUESTION_001",
          message: data.error?.message || "Failed to add question",
        },
      }
    }

    return data
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "SYS_001",
        message: "Failed to connect to the server",
      },
    }
  }
}

export async function updateQuestion(
  lessonId: string,
  questionId: string,
  question: Partial<Question>
): Promise<ApiResponse<{ question: Question }>> {
  try {
    const response = await fetch(
      `${API_URL}/lessons/${lessonId}/questions/${questionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(question),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: {
          code: data.error?.code || "QUESTION_002",
          message: data.error?.message || "Failed to update question",
        },
      }
    }

    return data
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "SYS_001",
        message: "Failed to connect to the server",
      },
    }
  }
}

export async function deleteQuestion(
  lessonId: string,
  questionId: string
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(
      `${API_URL}/lessons/${lessonId}/questions/${questionId}`,
      {
        method: "DELETE",
        headers: getAuthHeader(),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: {
          code: data.error?.code || "QUESTION_003",
          message: data.error?.message || "Failed to delete question",
        },
      }
    }

    return data
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "SYS_001",
        message: "Failed to connect to the server",
      },
    }
  }
} 