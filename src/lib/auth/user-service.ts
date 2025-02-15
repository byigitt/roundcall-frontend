import { getTokens } from "./tokens"

interface UserResponse {
  status: "success" | "error";
  data?: {
    user: {
      _id: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      department: string;
      role: 'user' | 'admin' | 'trainer' | 'trainee';
      isActive: boolean;
      lastLogin: string;
    };
  };
  message?: string;
  code?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function getUserProfile(): Promise<UserResponse> {
  try {
    const { token } = getTokens();
    if (!token) {
      return {
        status: "error",
        message: "No auth token found",
        code: "AUTH_001"
      };
    }

    const response = await fetch(`${API_URL}/auth/me`, {
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
        message: data.message || "Failed to fetch user profile",
        code: data.code || "USER_001"
      };
    }

    return data;
  } catch (error) {
    return {
      status: "error",
      message: "Failed to fetch user profile",
      code: "USER_001"
    };
  }
} 