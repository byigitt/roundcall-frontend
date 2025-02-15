# API Response Documentation

This document outlines all API responses for the Call Center Training Platform's backend. Each endpoint's response format is documented below, including success and error cases.

## Table of Contents

- [Common Response Format](#common-response-format)
- [Authentication Responses](#authentication-responses)
- [User Management Responses](#user-management-responses)
- [Lesson Responses](#lesson-responses)
- [Question Responses](#question-responses)
- [Training Responses](#training-responses)
- [Score Responses](#score-responses)
- [Health Check Response](#health-check-response)
- [Common Error Responses](#common-error-responses)

## Common Response Format

All API responses follow these general structures:

### Success Response Format

```typescript
{
  status: 'success',
  data: {
    // Response data specific to each endpoint
  },
  message?: string // Optional success message
}
```

### Error Response Format

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any // Additional error details if available
  }
}
```

## Health Check Response

### GET /health

**Success Response (200)**

```typescript
{
  status: "ok";
}
```

## Undefined Routes Response

### ANY \*

**Error Response (404)**

```typescript
{
  status: 'error',
  message: 'Cannot ${method} ${path}'
}
```

## Authentication Responses

### POST /api/auth/register

**Success Response (201)**

```typescript
{
  status: 'success',
  data: {
    user: {
      _id: string,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      department: string,
      role: 'user' | 'admin',
      lastLogin: string | null,
      isActive: boolean,
      createdAt: string,
      updatedAt: string
    },
    token: string,
    refreshToken: string,
    expiresIn: number // Token expiration in seconds
  }
}
```

**Error Responses**

```typescript
{
  success: false,
  error: {
    code: 'USER_001',
    message: 'Username already taken'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'USER_002',
    message: 'Email already in use'
  }
}
```

### POST /api/auth/login

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    user: {
      _id: string,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      department: string,
      role: 'user' | 'admin',
      lastLogin: string,
      isActive: boolean,
      createdAt: string,
      updatedAt: string
    },
    token: string,
    refreshToken: string,
    expiresIn: number // Token expiration in seconds
  }
}
```

**Error Responses**

```typescript
{
  success: false,
  error: {
    code: 'AUTH_001',
    message: 'Please provide email/username and password'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'AUTH_001',
    message: 'Incorrect email/username or password'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'AUTH_006',
    message: 'Account is locked. Please try again in {waitTime} minutes'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'AUTH_006',
    message: 'Too many failed login attempts. Account is locked for 15 minutes'
  }
}
```

### POST /api/auth/refresh

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    token: string,
    expiresIn: number // Token expiration in seconds
  }
}
```

**Error Responses**

```typescript
{
  success: false,
  error: {
    code: 'AUTH_001',
    message: 'Please provide refresh token'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'AUTH_003',
    message: 'Invalid refresh token'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'USER_001',
    message: 'User not found'
  }
}
```

### POST /api/auth/password/reset-request

**Success Response (200)**

```typescript
{
  status: 'success',
  message: 'Token sent to email',
  data: {
    resetToken: string // Note: Only included in development
  }
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'USER_001',
    message: 'No user found with that email address'
  }
}
```

### POST /api/auth/password/reset

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    user: {
      _id: string,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      department: string,
      role: 'user' | 'admin',
      lastLogin: string,
      isActive: boolean,
      createdAt: string,
      updatedAt: string
    },
    token: string,
    refreshToken: string,
    expiresIn: number
  }
}
```

**Error Response (400)**

```typescript
{
  success: false,
  error: {
    code: 'AUTH_005',
    message: 'Token is invalid or has expired'
  }
}
```

### POST /api/auth/password/change

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    user: {
      _id: string,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      department: string,
      role: 'user' | 'admin',
      lastLogin: string,
      isActive: boolean,
      createdAt: string,
      updatedAt: string
    },
    token: string,
    refreshToken: string,
    expiresIn: number
  }
}
```

**Error Responses**

```typescript
{
  success: false,
  error: {
    code: 'USER_001',
    message: 'User not found'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'AUTH_001',
    message: 'Current password is incorrect'
  }
}
```

### POST /api/auth/logout

**Success Response (200)**

```typescript
{
  status: 'success',
  data: null
}
```

**Error Response (401)**

```typescript
{
  success: false,
  error: {
    code: 'AUTH_006',
    message: 'User already logged out'
  }
}
```

### GET /api/users/me

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    user: {
      _id: string,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      department: string,
      role: 'user' | 'admin',
      lastLogin: string,
      isActive: boolean,
      createdAt: string,
      updatedAt: string
    }
  }
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'USER_003',
    message: 'User not found'
  }
}
```

## User Management Responses

### GET /api/users (Admin Only)

**Query Parameters**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `role`: Filter by user role ('user' | 'admin')
- `department`: Filter by department
- `search`: Search in username, email, firstName, lastName
- `sort`: Sort field and order (e.g., 'createdAt:desc')

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    users: [{
      _id: string,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      department: string,
      role: 'user' | 'admin',
      lastLogin: string,
      isActive: boolean,
      createdAt: string,
      updatedAt: string
    }]
  },
  meta: {
    page: number,
    limit: number,
    total: number,
    hasMore: boolean
  }
}
```

### GET /api/users/:id

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    user: {
      _id: string,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      department: string,
      role: 'user' | 'admin',
      lastLogin: string,
      isActive: boolean,
      createdAt: string,
      updatedAt: string
    }
  }
}
```

**Error Responses**

```typescript
{
  success: false,
  error: {
    code: 'USER_001',
    message: 'User not found'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'AUTH_004',
    message: 'Not authorized to access this profile'
  }
}
```

### PUT /api/users/:id

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    user: {
      _id: string,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      department: string,
      role: 'user' | 'admin',
      lastLogin: string,
      isActive: boolean,
      createdAt: string,
      updatedAt: string
    }
  }
}
```

**Error Responses**

```typescript
{
  success: false,
  error: {
    code: 'USER_001',
    message: 'User not found'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'AUTH_004',
    message: 'Not authorized to update this profile'
  }
}
```

### DELETE /api/users/:id

**Success Response (204)**

```typescript
{
  status: 'success',
  data: null
}
```

**Error Responses**

```typescript
{
  success: false,
  error: {
    code: 'USER_001',
    message: 'User not found'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'AUTH_004',
    message: 'Not authorized to delete this profile'
  }
}
```

## Lesson Responses

### POST /api/lessons

**Success Response (201)**

```typescript
{
  status: 'success',
  data: {
    lesson: {
      _id: string,
      title: string,
      content: string,
      videoUrl?: string,
      createdAt: string,
      updatedAt: string
    }
  }
}
```

**Error Response (400)**

```typescript
{
  success: false,
  error: {
    code: 'LESS_002',
    message: 'Lesson with this title already exists'
  }
}
```

### GET /api/lessons

**Query Parameters**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (default: '-createdAt')
- `search`: Search term for title and content

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    lessons: [{
      _id: string,
      title: string,
      content: string,
      videoUrl?: string,
      createdAt: string,
      updatedAt: string
    }]
  },
  meta: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}
```

### GET /api/lessons/:id

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    lesson: {
      _id: string,
      title: string,
      content: string,
      videoUrl?: string,
      createdAt: string,
      updatedAt: string
    }
  }
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'LESS_001',
    message: 'Lesson not found'
  }
}
```

### PUT /api/lessons/:id

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    lesson: {
      _id: string,
      title: string,
      content: string,
      videoUrl?: string,
      createdAt: string,
      updatedAt: string
    }
  }
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'LESS_001',
    message: 'Lesson not found'
  }
}
```

### DELETE /api/lessons/:id

**Success Response (204)**

```typescript
{
  status: 'success',
  data: null
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'LESS_001',
    message: 'Lesson not found'
  }
}
```

## Question Responses

### POST /api/questions

**Success Response (201)**

```typescript
{
  status: 'success',
  data: {
    question: {
      _id: string,
      lesson: string, // Lesson ID
      questionText: string,
      type: 'textRecall' | 'multipleChoice',
      difficulty?: 'easy' | 'medium' | 'hard',
      options?: string[], // Only for multipleChoice type
      correctAnswer: string | number,
      createdAt: string,
      updatedAt: string
    }
  }
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'LESS_001',
    message: 'Lesson not found'
  }
}
```

### GET /api/questions

**Query Parameters**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `lesson`: Filter by lesson ID
- `type`: Filter by question type ('textRecall' | 'multipleChoice')
- `difficulty`: Filter by difficulty level ('easy' | 'medium' | 'hard')

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    questions: [{
      _id: string,
      lesson: {
        _id: string,
        title: string
      },
      questionText: string,
      type: 'textRecall' | 'multipleChoice',
      difficulty?: 'easy' | 'medium' | 'hard',
      options?: string[],
      correctAnswer: string | number,
      createdAt: string,
      updatedAt: string
    }]
  },
  meta: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}
```

### GET /api/questions/:id

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    question: {
      _id: string,
      lesson: {
        _id: string,
        title: string
      },
      questionText: string,
      type: 'textRecall' | 'multipleChoice',
      difficulty?: 'easy' | 'medium' | 'hard',
      options?: string[],
      correctAnswer: string | number,
      createdAt: string,
      updatedAt: string
    }
  }
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'QUES_001',
    message: 'Question not found'
  }
}
```

### PUT /api/questions/:id

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    question: {
      _id: string,
      lesson: string,
      questionText: string,
      type: 'textRecall' | 'multipleChoice',
      difficulty?: 'easy' | 'medium' | 'hard',
      options?: string[],
      correctAnswer: string | number,
      createdAt: string,
      updatedAt: string
    }
  }
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'QUES_001',
    message: 'Question not found'
  }
}
```

### DELETE /api/questions/:id

**Success Response (204)**

```typescript
{
  status: 'success',
  data: null
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'QUES_001',
    message: 'Question not found'
  }
}
```

### GET /api/questions/lesson/:lessonId

**Query Parameters**

- `type`: Filter by question type ('textRecall' | 'multipleChoice')
- `difficulty`: Filter by difficulty level ('easy' | 'medium' | 'hard')

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    questions: [{
      _id: string,
      lesson: {
        _id: string,
        title: string
      },
      questionText: string,
      type: 'textRecall' | 'multipleChoice',
      difficulty?: 'easy' | 'medium' | 'hard',
      options?: string[],
      correctAnswer: string | number,
      createdAt: string,
      updatedAt: string
    }]
  }
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'LESS_001',
    message: 'Lesson not found'
  }
}
```

## Training Responses

### POST /api/training/start/:lessonId

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    session: {
      _id: string,
      lesson: {
        _id: string,
        title: string
      },
      text: string,
      displayDuration: number,
      questions: [{
        _id: string,
        questionText: string,
        type: 'textRecall' | 'multipleChoice',
        options?: string[],
        difficulty?: 'easy' | 'medium' | 'hard'
      }],
      startedAt: string,
      expiresAt: string
    }
  }
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'LESS_001',
    message: 'Lesson not found'
  }
}
```

### POST /api/training/sessions/:sessionId/submit

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    results: {
      sessionId: string,
      totalScore: number,
      correctAnswers: number,
      totalQuestions: number,
      accuracy: number, // Percentage
      averageResponseTime: number, // In milliseconds
      answers: [{
        questionId: string,
        answer: string | number,
        isCorrect: boolean,
        points: number,
        responseTime: number,
        correctAnswer: string | number,
        explanation?: string
      }]
    }
  }
}
```

**Error Responses**

```typescript
{
  success: false,
  error: {
    code: 'TRAIN_001',
    message: 'Training session not found'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'TRAIN_002',
    message: 'Training session has expired'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid answer format',
    details: {
      answers: ['Required field missing']
    }
  }
}
```

### GET /api/training/sessions/:sessionId

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    session: {
      _id: string,
      lesson: {
        _id: string,
        title: string
      },
      user: {
        _id: string,
        username: string
      },
      totalScore: number,
      correctAnswers: number,
      totalQuestions: number,
      accuracy: number,
      averageResponseTime: number,
      answers: [{
        question: {
          _id: string,
          questionText: string,
          type: 'textRecall' | 'multipleChoice'
        },
        answer: string | number,
        isCorrect: boolean,
        points: number,
        responseTime: number,
        correctAnswer: string | number,
        explanation?: string
      }],
      startedAt: string,
      completedAt: string
    }
  }
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'TRAIN_001',
    message: 'Training session not found'
  }
}
```

### GET /api/training/history

**Query Parameters**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `lesson`: Filter by lesson ID
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    sessions: [{
      _id: string,
      lesson: {
        _id: string,
        title: string
      },
      totalScore: number,
      correctAnswers: number,
      totalQuestions: number,
      accuracy: number,
      averageResponseTime: number,
      startedAt: string,
      completedAt: string
    }]
  },
  meta: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}
```

## Score Responses

### POST /api/scores/submit

**Success Response (201)**

```typescript
{
  status: 'success',
  data: {
    score: {
      _id: string,
      user: string,
      question: string,
      lesson: string,
      answer: string | number,
      isCorrect: boolean,
      points: number,
      responseTime: number,
      createdAt: string,
      updatedAt: string
    }
  }
}
```

**Error Response (404)**

```typescript
{
  success: false,
  error: {
    code: 'QUES_001',
    message: 'Question not found'
  }
}
```

### GET /api/scores/user/:userId

**Query Parameters**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    scores: [{
      _id: string,
      user: string,
      question: {
        _id: string,
        text: string,
        type: 'textRecall' | 'multipleChoice'
      },
      lesson: {
        _id: string,
        title: string
      },
      answer: string | number,
      isCorrect: boolean,
      points: number,
      responseTime: number,
      createdAt: string,
      updatedAt: string
    }]
  },
  meta: {
    page: number,
    limit: number,
    total: number,
    hasMore: boolean
  }
}
```

**Error Responses**

```typescript
{
  success: false,
  error: {
    code: 'USER_001',
    message: 'User not found'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'AUTH_004',
    message: 'Not authorized to view these scores'
  }
}
```

### GET /api/scores/performance/:userId

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    performance: {
      totalPoints: number,
      totalQuestions: number,
      correctAnswers: number,
      accuracy: number, // Percentage
      averageResponseTime: number // In milliseconds
    }
  }
}
```

**Error Responses**

```typescript
{
  success: false,
  error: {
    code: 'USER_001',
    message: 'User not found'
  }
}
```

```typescript
{
  success: false,
  error: {
    code: 'AUTH_004',
    message: 'Not authorized to view this performance'
  }
}
```

### GET /api/scores/leaderboard

**Query Parameters**

- `limit`: Number of top users to return (default: 10, max: 100)

**Success Response (200)**

```typescript
{
  status: 'success',
  data: {
    leaderboard: [{
      user: {
        id: string,
        username: string,
        firstName: string,
        lastName: string
      },
      totalPoints: number,
      correctAnswers: number,
      totalQuestions: number,
      accuracy: number // Percentage
    }]
  }
}
```

## Common Error Responses

### Authentication Errors

**401 Unauthorized**

```typescript
{
  success: false,
  error: {
    code: "AUTH_001",
    message: "Authentication required"
  }
}
```

**403 Forbidden**

```typescript
{
  success: false,
  error: {
    code: "AUTH_004",
    message: "Insufficient permissions"
  }
}
```

### Rate Limiting Errors

**429 Too Many Requests**

```typescript
{
  success: false,
  error: {
    code: "AUTH_003",
    message: "Too many requests, please try again later",
    details: {
      retryAfter: number // Seconds until next request is allowed
    }
  }
}
```

**Login Rate Limit (429)**

```typescript
{
  success: false,
  error: {
    code: "AUTH_003",
    message: "Too many login attempts, please try again later",
    details: {
      retryAfter: 900 // 15 minutes in seconds
    }
  }
}
```

**Password Reset Rate Limit (429)**

```typescript
{
  success: false,
  error: {
    code: "AUTH_003",
    message: "Too many password reset attempts, please try again later",
    details: {
      retryAfter: 3600 // 1 hour in seconds
    }
  }
}
```

**Refresh Token Rate Limit (429)**

```typescript
{
  success: false,
  error: {
    code: "AUTH_003",
    message: "Too many refresh attempts, please try again later",
    details: {
      retryAfter: 900 // 15 minutes in seconds
    }
  }
}
```

### Validation Errors

**400 Bad Request**

```typescript
{
  success: false,
  error: {
    code: "VAL_001",
    message: "Validation failed",
    details: {
      field: ["error message"]
    }
  }
}
```

### Resource Errors

**404 Not Found**

```typescript
{
  success: false,
  error: {
    code: "NOT_FOUND",
    message: "Resource not found"
  }
}
```

### Server Errors

**500 Internal Server Error**

```typescript
{
  success: false,
  error: {
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred"
  }
}
```

### Request Timeout Error

**408 Request Timeout**

```typescript
{
  status: 'error',
  message: "Request timeout",
  error: {
    code: "REQUEST_TIMEOUT"
  }
}
```
