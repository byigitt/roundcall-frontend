import { getTokens } from "./tokens"

interface UserResponse {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Trainer' | 'Trainee';
  department: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export async function getUserProfile(): Promise<{ status: "success" | "error", data?: { user: UserResponse }, error?: any }> {
  try {
    const { token } = getTokens();
    if (!token) {
      return {
        status: "error",
        error: {
          code: "AUTH_001",
          message: "No auth token found"
        }
      };
    }

    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        error: {
          code: "USER_001",
          message: data.message || "Failed to fetch user profile"
        }
      };
    }

    return {
      status: "success",
      data: {
        user: {
          _id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          department: data.department,
          isActive: true,
          lastLogin: new Date().toISOString(),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        }
      }
    };
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "USER_001",
        message: "Failed to fetch user profile"
      }
    };
  }
} 