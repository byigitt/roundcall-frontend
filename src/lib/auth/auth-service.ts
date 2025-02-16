import { setTokens, removeTokens, isTokenExpired, getTokens, getAuthHeader } from "@/lib/auth/tokens"
import { getUserProfile } from "./user-service";

interface AuthResponse {
  status?: 'success' | 'error';
  data?: {
    user: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      department: string;
      role: 'Trainer' | 'Trainee';
      lastLogin: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
}

export type User = NonNullable<AuthResponse['data']>['user'];

interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Trainer' | 'Trainee';
  createdAt: string;
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export async function login({ email, password }: LoginRequest): Promise<AuthResponse> {
  try {
    console.log("🔑 Attempting login...")
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    console.log("📥 Login Response:", { status: response.status, ok: response.ok, data })

    if (!response.ok) {
      console.log("❌ Login failed:", data)
      return {
        status: 'error',
        error: {
          code: 'AUTH_001',
          message: data.message || "Invalid credentials"
        }
      }
    }

    if (!data.access_token) {
      console.log("❌ No access token in response:", data)
      return {
        status: 'error',
        error: {
          code: 'AUTH_002',
          message: "Invalid server response"
        }
      }
    }

    console.log("✅ Setting tokens...")
    setTokens({
      token: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in || 3600
    })

    // Fetch user profile after successful login
    console.log("👤 Fetching user profile...")
    const userResponse = await getUserProfile()
    console.log("📥 User Profile Response:", userResponse)
    
    if (userResponse.status === "error" || !userResponse.data?.user) {
      console.log("❌ Failed to fetch user profile:", userResponse)
      return {
        status: 'error',
        error: {
          code: 'USER_001',
          message: "Failed to fetch user profile"
        }
      }
    }

    console.log("✅ Login successful!")
    return {
      status: 'success',
      data: {
        user: userResponse.data.user,
        token: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in || 3600
      }
    }
  } catch (error) {
    console.error("💥 Login error:", error)
    return {
      status: 'error',
      error: {
        code: 'AUTH_999',
        message: "Failed to connect to the server. Please try again."
      }
    }
  }
}

export async function logout(): Promise<void> {
  try {
    // The new API might not require a logout endpoint
    // Just remove tokens locally
    removeTokens();
  } catch (error) {
    console.error("Logout error:", error);
    // Always remove tokens on error to ensure user can log in again
    removeTokens();
  }
}

export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        ...getAuthHeader()
      }
    });

    if (!response.ok) {
      return {
        status: 'error',
        error: {
          code: 'USER_003',
          message: 'User not found'
        }
      };
    }

    return await response.json();
  } catch (error) {
    return {
      status: 'error',
      error: {
        code: 'USER_999',
        message: 'Failed to fetch user profile'
      }
    };
  }
}

// Function to check auth status
export async function checkAuth(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch {
    return false;
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