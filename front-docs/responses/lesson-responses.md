# Lesson Management API Responses

## Create Lesson

```http
POST /api/lessons
```

**Request Body - Regular Text Lesson**

```json
{
  "title": "Customer Service Basics",
  "description": "Learn the essential principles of customer service",
  "contentType": "text",
  "textContent": "In this lesson, we will cover the fundamental principles of customer service...",
  "difficulty": "beginner",
  "tags": ["customer-service", "fundamentals"]
}
```

**Request Body - Timed Text Lesson**

```json
{
  "title": "Quick Response Training",
  "description": "Practice quick thinking and response in customer service scenarios",
  "contentType": "timed_text",
  "textContent": "A customer approaches you angrily about a defective product. How do you respond?",
  "displayTime": 10000, // 10 seconds in milliseconds
  "difficulty": "intermediate",
  "tags": ["customer-service", "quick-response", "training"]
}
```

**Request Body - Video Lesson**

```json
{
  "title": "Customer Service Video Guide",
  "description": "Watch and learn from real customer service scenarios",
  "contentType": "video",
  "videoUrl": "https://example.com/videos/customer-service-guide",
  "duration": 1800, // 30 minutes in seconds
  "difficulty": "beginner",
  "tags": ["customer-service", "video-guide"]
}
```

**Request Body - Hybrid Lesson**

```json
{
  "title": "Complete Customer Service Training",
  "description": "Comprehensive training with text and video content",
  "contentType": "both",
  "textContent": "This comprehensive guide combines written materials with video examples...",
  "videoUrl": "https://example.com/videos/customer-service-complete",
  "duration": 3600,
  "difficulty": "advanced",
  "tags": ["customer-service", "comprehensive", "training"]
}
```

**Success Response (201)**

```json
{
  "status": "success",
  "data": {
    "lesson": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Quick Response Training",
      "description": "Practice quick thinking and response in customer service scenarios",
      "contentType": "timed_text",
      "textContent": "A customer approaches you angrily about a defective product. How do you respond?",
      "displayTime": 10000,
      "difficulty": "intermediate",
      "tags": ["customer-service", "quick-response", "training"],
      "createdBy": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe"
      },
      "lastUpdatedBy": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe"
      },
      "isActive": true,
      "totalEnrolled": 0,
      "averageRating": 0,
      "createdAt": "2024-02-15T10:30:00Z",
      "updatedAt": "2024-02-15T10:30:00Z"
    }
  }
}
```

## Get All Lessons

```http
GET /api/lessons
```

**Query Parameters**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `contentType` (optional): Filter by content type ('text', 'video', 'both', 'timed_text')
- `difficulty` (optional): Filter by difficulty level
- `tags` (optional): Filter by tags (comma-separated)
- `createdBy` (optional): Filter by creator ID
- `search` (optional): Search in title and description
- `sort` (optional): Sort field and order (e.g., 'createdAt:desc', 'totalEnrolled:desc')

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "lessons": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Quick Response Training",
        "description": "Practice quick thinking and response in customer service scenarios",
        "contentType": "timed_text",
        "displayTime": 10000,
        "difficulty": "intermediate",
        "tags": ["customer-service", "quick-response", "training"],
        "totalEnrolled": 45,
        "averageRating": 4.5,
        "createdAt": "2024-02-15T10:30:00Z",
        "updatedAt": "2024-02-15T10:30:00Z"
      }
      // ... more lessons
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

## Get Single Lesson

```http
GET /api/lessons/:id
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "lesson": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Customer Service Basics",
      "description": "Learn the essential principles of excellent customer service",
      "contentType": "both",
      "textContent": "In this lesson, we will cover the fundamental principles of customer service...",
      "videoUrl": "https://example.com/videos/customer-service-basics",
      "duration": 1800,
      "difficulty": "beginner",
      "tags": ["customer-service", "fundamentals"],
      "createdBy": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe"
      },
      "lastUpdatedBy": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe"
      },
      "totalEnrolled": 45,
      "averageRating": 4.5,
      "createdAt": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-15T10:30:00Z"
    },
    "progress": {
      "totalQuestions": 10,
      "completedQuestions": 8,
      "averageScore": 85.5,
      "lastAttempt": "2024-03-15T15:45:00Z"
    }
  }
}
```

## Update Lesson

```http
PATCH /api/lessons/:id
```

**Request Body**

```json
{
  "title": "Updated Customer Service Basics",
  "description": "Updated description...",
  "tags": ["customer-service", "fundamentals", "communication"]
}
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "lesson": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Updated Customer Service Basics",
      "description": "Updated description...",
      "contentType": "both",
      "textContent": "In this lesson, we will cover the fundamental principles of customer service...",
      "videoUrl": "https://example.com/videos/customer-service-basics",
      "duration": 1800,
      "difficulty": "beginner",
      "tags": ["customer-service", "fundamentals", "communication"],
      "createdBy": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe"
      },
      "lastUpdatedBy": {
        "_id": "507f1f77bcf86cd799439012",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "totalEnrolled": 45,
      "averageRating": 4.5,
      "createdAt": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-15T11:00:00Z"
    }
  }
}
```

## Delete Lesson

```http
DELETE /api/lessons/:id
```

**Success Response (204)**
No content

## Get Trainee's Lesson Progress

```http
GET /api/lessons/:lessonId/trainees/:traineeId/progress
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "lesson": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Customer Service Basics"
      // ... other lesson fields
    },
    "progress": {
      "totalQuestions": 10,
      "completedQuestions": 8,
      "averageScore": 85.5,
      "questionDetails": [
        {
          "questionId": "507f1f77bcf86cd799439014",
          "status": "completed",
          "score": 90,
          "attempts": 1,
          "lastAttempt": "2024-03-15T15:45:00Z"
        }
        // ... more question details
      ],
      "startedAt": "2024-03-15T10:35:00Z",
      "lastActivity": "2024-03-15T15:45:00Z"
    }
  }
}
```

## Error Responses

### Not Found

**Lesson Not Found (404)**

```json
{
  "status": "error",
  "error": {
    "code": "LESS_001",
    "message": "Lesson not found"
  }
}
```

### Authorization Errors

**Not Authorized (403)**

```json
{
  "status": "error",
  "error": {
    "code": "AUTH_004",
    "message": "Not authorized to access this resource"
  }
}
```

### Validation Errors

**Invalid Lesson Data (400)**

```json
{
  "status": "error",
  "error": {
    "code": "LESS_003",
    "message": "Validation failed",
    "details": {
      "title": ["Title must be between 5 and 200 characters"],
      "description": ["Description must be between 20 and 1000 characters"],
      "contentType": ["Content type must be one of: text, video, both"]
    }
  }
}
```

**Invalid Content Type Requirements (400)**

```json
{
  "status": "error",
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "contentType": ["Invalid content type"],
      "displayTime": [
        "Display time must be between 5 and 300 seconds (in milliseconds)"
      ],
      "textContent": ["Text content is required for timed text lessons"]
    }
  }
}
```

**Invalid Video URL (400)**

```json
{
  "status": "error",
  "error": {
    "code": "LESS_005",
    "message": "Invalid video URL format"
  }
}
```

**Missing Text Content (400)**

```json
{
  "status": "error",
  "error": {
    "code": "LESS_006",
    "message": "Text content is required for text or hybrid lessons"
  }
}
```

### Resource Conflict

**Duplicate Title (409)**

```json
{
  "status": "error",
  "error": {
    "code": "LESS_002",
    "message": "A lesson with this title already exists"
  }
}
```
