# Lesson Management API Responses

## Create Lesson

```http
POST /api/lessons
```

**Request Body**

```json
{
  "title": "Customer Service Basics",
  "description": "Learn the essential principles of excellent customer service",
  "contentType": "both", // text, video, both
  "textContent": "In this lesson, we will cover the fundamental principles of customer service...",
  "videoUrl": "https://example.com/videos/customer-service-basics",
  "duration": 1800, // in seconds (required for video content)
  "difficulty": "beginner", // beginner, intermediate, advanced
  "tags": ["customer-service", "fundamentals"]
}
```

**Success Response (201)**

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
      "totalEnrolled": 0,
      "averageRating": 0,
      "isActive": true,
      "createdAt": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-15T10:30:00Z"
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
- `limit` (optional): Items per page (default: 10)
- `contentType` (optional): Filter by content type (text, video, both)
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
        "title": "Customer Service Basics",
        "description": "Learn the essential principles of excellent customer service",
        "contentType": "both",
        "duration": 1800,
        "difficulty": "beginner",
        "tags": ["customer-service", "fundamentals"],
        "createdBy": {
          "_id": "507f1f77bcf86cd799439011",
          "firstName": "John",
          "lastName": "Doe"
        },
        "totalEnrolled": 45,
        "averageRating": 4.5,
        "createdAt": "2024-03-15T10:30:00Z",
        "updatedAt": "2024-03-15T10:30:00Z"
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
    "code": "LESS_004",
    "message": "Video URL and duration are required for video or hybrid lessons"
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
