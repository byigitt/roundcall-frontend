import { getTokens } from "@/lib/auth/tokens"

interface ChatMessage {
  role: "customer" | "agent"
  content: string
  timestamp: string
}

interface Analysis {
  profesyonellik: number
  empati: number
  cozum_odaklilik: number
  iletisim: number
  genel_puan: number
  detayli_analiz: string
}

interface CollectedInfo {
  fiyat: boolean
  taahhut: boolean
  hiz: boolean
  kurulum: boolean
  cayma_bedeli: boolean
}

interface ChatbotStartResponse {
  status: "success" | "error"
  data?: {
    id: string
    traineeID: string
    characterType: string
    messages: ChatMessage[]
    createdAt: string
    updatedAt: string
    isActive: boolean
  }
  error?: {
    message: string
  }
}

interface ChatbotMessageResponse {
  status: "success" | "error"
  data?: {
    message: string
    analysis: Analysis
    collectedInfo: CollectedInfo
  }
  error?: {
    message: string
  }
}

export async function startChatbot(characterType: string): Promise<ChatbotStartResponse> {
  try {
    const { token } = getTokens()
    console.log("Token:", token)
    console.log("Character Type:", characterType)
    console.log("Request URL:", `http://localhost:8000/api/v1/chatbot/start?character_type=${characterType}`)

    const response = await fetch(
      `http://localhost:8000/api/v1/chatbot/start?character_type=${characterType}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    console.log("Response Status:", response.status)
    const data = await response.json()
    console.log("Response Data:", data)

    if (!response.ok) {
      return {
        status: "error",
        error: {
          message: data.detail || data.message || `HTTP Error: ${response.status} - ${response.statusText}`,
        },
      }
    }
    
    return {
      status: "success",
      data: data
    }
  } catch (error) {
    console.error("Chatbot Start Error:", error)
    return {
      status: "error",
      error: {
        message: error instanceof Error ? error.message : "Chatbot başlatılırken bir hata oluştu.",
      },
    }
  }
}

export async function sendMessage(conversationId: string, message: string): Promise<ChatbotMessageResponse> {
  try {
    const { token } = getTokens()
    console.log("Token:", token)
    console.log("Conversation ID:", conversationId)
    console.log("Message:", message)
    console.log("Request URL:", `http://localhost:8000/api/v1/chatbot/${conversationId}/message?message=${encodeURIComponent(message)}`)

    const response = await fetch(
      `http://localhost:8000/api/v1/chatbot/${conversationId}/message?message=${encodeURIComponent(message)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    console.log("Response Status:", response.status)
    const data = await response.json()
    console.log("Response Data:", data)

    if (!response.ok) {
      return {
        status: "error",
        error: {
          message: data.detail || data.message || `HTTP Error: ${response.status} - ${response.statusText}`,
        },
      }
    }
    
    return {
      status: "success",
      data: data
    }
  } catch (error) {
    console.error("Send Message Error:", error)
    return {
      status: "error",
      error: {
        message: error instanceof Error ? error.message : "Mesaj gönderilirken bir hata oluştu.",
      },
    }
  }
} 