import { setTokens, removeTokens, isTokenExpired, getTokens, getAuthHeader } from "@/lib/auth/tokens"

interface AuthResponse {
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
      loginAttempts: number;
      createdAt: string;
      updatedAt: string;
      lastLogin: string;
    };
    token: string;
    refreshToken: string;
    expiresIn: string;
  };
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ResetPasswordRequest {
  email: string;
}

interface ResetPasswordConfirmRequest {
  token: string;
  password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

async function refreshAccessToken(): Promise<AuthResponse> {
  try {
    const { refreshToken } = getTokens();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    if (data.status === 'success' && data.data) {
      setTokens({
        token: data.data.token,
        refreshToken: data.data.refreshToken,
        expiresIn: parseInt(data.data.expiresIn),
      });
    }

    return data;
  } catch (error) {
    removeTokens();
    throw error;
  }
}

export async function login({ email, password }: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    const data: AuthResponse = await response.json()

    if (data.status === "success" && data.data) {
      // Convert expiresIn from "1h" to seconds
      const expiresIn = data.data.expiresIn.includes('h') 
        ? parseInt(data.data.expiresIn) * 3600 
        : parseInt(data.data.expiresIn);

      setTokens({
        token: data.data.token,
        refreshToken: data.data.refreshToken,
        expiresIn,
      })
    }

    return data
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to connect to the server. Please try again.",
      },
    }
  }
}

export async function logout(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    removeTokens()
  }
}

export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/password/reset-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    })

    const data = await response.json()
    return {
      status: "success",
      message: "If an account exists with this email, you will receive password reset instructions.",
    }
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send reset password request. Please try again.",
      },
    }
  }
}

export async function confirmResetPassword({
  token,
  password,
}: ResetPasswordConfirmRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/password/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ token, password }),
    })

    const data = await response.json()

    if (response.ok) {
      return {
        status: "success",
        message: "Password has been successfully reset. Please login with your new password.",
      }
    }

    return data
  } catch (error) {
    return {
      status: "error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to reset password. Please try again.",
      },
    }
  }
}

// Function to check auth status
export async function checkAuth(): Promise<boolean> {
  if (isTokenExpired()) {
    try {
      await refreshAccessToken();
      return true;
    } catch {
      return false;
    }
  }
  return true;
} 