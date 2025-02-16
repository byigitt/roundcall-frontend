"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Play } from "lucide-react"
import { startChatbot, sendMessage } from "@/lib/services/chatbot-service"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface Message {
  role: "customer" | "agent"
  content: string
  timestamp?: string
}

interface Analysis {
  profesyonellik: number
  empati: number
  cozum_odaklilik: number
  iletisim: number
  genel_puan: number
  detayli_analiz: string
}

const removeMarkdownAsterisks = (text: string) => {
  return text.replace(/\*\*/g, '');
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleStartChatbot = async () => {
    setIsLoading(true)
    try {
      const startResponse = await startChatbot("happy_customer")
      if (startResponse.status === "success" && startResponse.data) {
        setConversationId(startResponse.data.id)
        if (startResponse.data.messages && startResponse.data.messages.length > 0) {
          const firstMessage = startResponse.data.messages[0]
          setMessages([{
            ...firstMessage,
            role: "agent"
          }])
        }
      } else {
        toast({
          variant: "destructive",
          title: "Hata",
          description: startResponse.error?.message || "Chatbot başlatılamadı.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Chatbot başlatılırken bir hata oluştu.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !conversationId) return

    const userMessage: Message = {
      role: "customer",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendMessage(conversationId, userMessage.content)
      if (response.status === "success" && response.data) {
        const botMessage: Message = {
          role: "agent",
          content: response.data.message,
        }
        setMessages((prev) => [...prev, botMessage])
        if (response.data.analysis) {
          setAnalysis({
            ...response.data.analysis,
            detayli_analiz: removeMarkdownAsterisks(response.data.analysis.detayli_analiz)
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "Hata",
          description: response.error?.message || "Mesaj gönderilemedi.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Mesaj gönderilirken bir hata oluştu.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="grid gap-4 grid-cols-[2fr_1fr]">
        <Card className="h-[800px] flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Chatbot Asistanı</CardTitle>
                <CardDescription>Müşteri hizmetleri simülasyonu için chatbot</CardDescription>
              </div>
              <Button 
                onClick={handleStartChatbot} 
                disabled={isLoading || conversationId !== null}
                className="w-32"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Başlatılıyor
                  </div>
                ) : conversationId ? (
                  "Aktif"
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Başlat
                  </div>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {!conversationId && !isLoading && (
                  <div className="flex justify-center items-center h-32 text-muted-foreground">
                    Chatbot'u başlatmak için "Başlat" butonuna tıklayın
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "customer" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "customer"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Mesajınızı yazın..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSendMessage()
                  }
                }}
                disabled={isLoading || !conversationId}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim() || !conversationId}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-[800px]">
          <CardContent>
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {analysis ? (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Detaylı Analiz</h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {analysis.detayli_analiz}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-32 text-muted-foreground">
                    Henüz analiz yapılmadı
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 