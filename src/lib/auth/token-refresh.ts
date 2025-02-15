import { getTokens, setTokens, removeTokens } from "./tokens"

interface RefreshTokenResponse {
  status: "success" | "error"
  data?: {
    token: string
    refreshToken: string
    expiresIn: number
  }
  error?: {
    code: string
    message: string
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function refreshToken(): Promise<RefreshTokenResponse> {
  try {
    const { refreshToken } = getTokens()

    if (!refreshToken) {
      return {
        status: "error",
        error: {
          code: "AUTH_004",
          message: "No refresh token found",
        },
      }
    }

    const response = await fetch(`${API_URL}/users/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    const data: RefreshTokenResponse = await response.json()

    if (data.status === "success" && data.data) {
      setTokens({
        token: data.data.token,
        refreshToken: data.data.refreshToken,
        expiresIn: data.data.expiresIn,
      })
    } else {
      // If refresh fails, clear tokens
      removeTokens()
    }

    return data
  } catch (error) {
    removeTokens()
    return {
      status: "error",
      error: {
        code: "AUTH_003",
        message: "Failed to refresh token",
      },
    }
  }
}

// Function to check if access token is expired or about to expire
export function shouldRefreshToken(): boolean {
  try {
    const { expiresIn } = getTokens()
    if (!expiresIn) return true

    // Refresh if less than 5 minutes remaining
    const fiveMinutes = 5 * 60
    return expiresIn <= fiveMinutes
  } catch {
    return true
  }
}

// Setup axios interceptor for automatic token refresh
export function setupAuthInterceptor(axiosInstance: any) {
  axiosInstance.interceptors.request.use(
    async (config: any) => {
      if (shouldRefreshToken()) {
        const result = await refreshToken()
        if (result.status === "success" && result.data?.token) {
          config.headers.Authorization = `Bearer ${result.data.token}`
        }
      }
      return config
    },
    (error: any) => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config

      // If error is 401 and we haven't tried to refresh yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const result = await refreshToken()
          if (result.status === "success" && result.data?.token) {
            originalRequest.headers.Authorization = `Bearer ${result.data.token}`
            return axiosInstance(originalRequest)
          }
        } catch (refreshError) {
          removeTokens()
        }
      }

      return Promise.reject(error)
    }
  )
} 