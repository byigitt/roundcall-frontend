"use client"

import { useEffect } from "react"
import { getAuthHeader } from "@/lib/auth/tokens"
import { AssignedLesson } from "../page"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface LessonAnalytics {
  lessonId: string
  assignmentId: string
  event: 'start' | 'progress' | 'complete' | 'view'
  data?: {
    progress?: number
    timeSpent?: number
    lastPosition?: number
  }
}

export async function trackLessonAnalytics(analytics: LessonAnalytics) {
  try {
    const response = await fetch(`${API_URL}/assigned-lessons/${analytics.assignmentId}/progress`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      credentials: 'include',
      body: JSON.stringify({
        progress: analytics.data?.progress || (analytics.event === 'start' ? 1 : undefined),
        status: analytics.event === 'start' ? 'in_progress' : 
               analytics.event === 'complete' ? 'completed' : undefined
      })
    })

    if (!response.ok) {
      console.error('Failed to track analytics:', await response.json())
    }
  } catch (error) {
    console.error('Error tracking analytics:', error)
  }
}

interface LessonTrackerProps {
  lesson: AssignedLesson
  isReading: boolean
}

export function LessonTracker({ lesson, isReading }: LessonTrackerProps) {
  useEffect(() => {
    let startTime: number
    let lastTrackTime: number
    let scrollPosition: number

    const trackProgress = () => {
      if (!isReading) return

      const now = Date.now()
      const timeSpent = now - startTime
      scrollPosition = window.scrollY

      // Track every 30 seconds or when scroll position changes significantly
      if (timeSpent - lastTrackTime >= 30000 || Math.abs(scrollPosition - window.scrollY) > 500) {
        trackLessonAnalytics({
          lessonId: lesson.lesson._id,
          assignmentId: lesson._id,
          event: 'progress',
          data: {
            progress: Math.min(Math.round((scrollPosition / document.documentElement.scrollHeight) * 100), 100),
            timeSpent,
            lastPosition: scrollPosition
          }
        })
        lastTrackTime = now
      }
    }

    if (isReading) {
      // Track start
      startTime = Date.now()
      lastTrackTime = startTime
      scrollPosition = window.scrollY

      trackLessonAnalytics({
        lessonId: lesson.lesson._id,
        assignmentId: lesson._id,
        event: 'start'
      })

      // Set up progress tracking
      window.addEventListener('scroll', trackProgress)
      const progressInterval = setInterval(trackProgress, 30000) // Also track every 30 seconds

      return () => {
        window.removeEventListener('scroll', trackProgress)
        clearInterval(progressInterval)
      }
    }
  }, [lesson, isReading])

  return null // This is a tracking component, no UI needed
} 