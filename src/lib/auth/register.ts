import { z } from "zod"

export const registerSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only alphanumeric characters and underscore allowed"),
  email: z.string()
    .email("Invalid email address")
    .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .regex(/^[a-zA-Z\s-]+$/, "Only letters, spaces, and hyphens allowed"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .regex(/^[a-zA-Z\s-]+$/, "Only letters, spaces, and hyphens allowed"),
  department: z.string()
    .min(2, "Department must be at least 2 characters")
    .max(50, "Department must be at most 50 characters")
    .optional(),
  role: z.enum(["admin", "user"])
})

export type RegisterRequest = z.infer<typeof registerSchema>

interface RegisterResponse {
  status: "success" | "error"
  data?: {
    user: {
      id: string
      username: string
      email: string
      role: string
      firstName: string
      lastName: string
      createdAt: string
    }
    token: string
    refreshToken: string
    expiresIn: number
  }
  error?: {
    code: string
    message: string
    details?: any
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result: RegisterResponse = await response.json()

    if (!response.ok) {
      return {
        status: "error",
        error: {
          code: result.error?.code || "USER_004",
          message: result.error?.message || "Registration failed. Please try again.",
          details: result.error?.details,
        },
      }
    }

    return result
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "SYS_001",
        message: "Failed to connect to the server. Please try again.",
      },
    }
  }
} 