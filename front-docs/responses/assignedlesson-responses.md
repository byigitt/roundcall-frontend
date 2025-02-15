# Assigned Lesson API Responses

## Assign Lesson to Trainees

```http
POST /api/assigned-lessons/assign
```

**Request Body**

```json
{
  "lessonId": "507f1f77bcf86cd799439013",
  "traineeEmails": ["trainee1@example.com", "trainee2@example.com"],
  "dueDate": "2024-03-01T00:00:00Z" // optional
}
```

**Success Response (201)**

```json
{
  "status": "success",
  "data": {
    "assignments": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "lesson": "507f1f77bcf86cd799439013",
        "trainee": {
          "_id": "507f1f77bcf86cd799439015",
          "email": "trainee1@example.com",
          "firstName": "John",
          "lastName": "Doe"
        },
        "assignedBy": "507f1f77bcf86cd799439016",
        "status": "pending",
        "progress": 0,
        "dueDate": "2024-03-01T00:00:00Z",
        "createdAt": "2024-02-15T10:30:00Z",
        "updatedAt": "2024-02-15T10:30:00Z",
        "isNewAssignment": true
      },
      {
        "_id": "507f1f77bcf86cd799439017",
        "lesson": "507f1f77bcf86cd799439013",
        "trainee": {
          "_id": "507f1f77bcf86cd799439018",
          "email": "trainee2@example.com",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "assignedBy": "507f1f77bcf86cd799439016",
        "status": "in_progress",
        "progress": 30,
        "dueDate": "2024-03-01T00:00:00Z",
        "createdAt": "2024-02-14T10:30:00Z",
        "updatedAt": "2024-02-15T10:30:00Z",
        "isNewAssignment": false
      }
    ],
    "summary": {
      "total": 2,
      "newAssignments": 1,
      "alreadyAssigned": 1
    }
  }
}
```

**Error Response - Already Assigned (400)**

```json
{
  "status": "error",
  "error": {
    "code": "ASSIGN_002",
    "message": "Lesson already assigned to all specified trainees"
  }
}
```

## Get Trainee's Assigned Lessons

```http
GET /api/assigned-lessons/my-lessons
```

**Query Parameters**

- `status` (optional): Filter by status ('pending', 'in_progress', 'completed', 'expired')
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "assignments": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "lesson": {
          "_id": "507f1f77bcf86cd799439013",
          "title": "Customer Service Basics",
          "description": "Learn the essential principles of customer service",
          "contentType": "text",
          "difficulty": "beginner",
          "tags": ["customer-service", "fundamentals"]
        },
        "assignedBy": {
          "_id": "507f1f77bcf86cd799439016",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "status": "in_progress",
        "progress": 45,
        "dueDate": "2024-03-01T00:00:00Z",
        "startedAt": "2024-02-15T11:00:00Z",
        "lastAccessedAt": "2024-02-15T15:30:00Z",
        "createdAt": "2024-02-15T10:30:00Z",
        "updatedAt": "2024-02-15T15:30:00Z"
      }
      // ... more assignments
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "hasMore": true
  }
}
```

## Update Lesson Progress

```http
PATCH /api/assigned-lessons/my-lessons/:lessonId/progress
```

**Request Body**

```json
{
  "progress": 75,
  "status": "in_progress"
}
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "assignment": {
      "_id": "507f1f77bcf86cd799439014",
      "lesson": "507f1f77bcf86cd799439013",
      "trainee": "507f1f77bcf86cd799439015",
      "status": "in_progress",
      "progress": 75,
      "startedAt": "2024-02-15T11:00:00Z",
      "lastAccessedAt": "2024-02-15T16:00:00Z",
      "updatedAt": "2024-02-15T16:00:00Z"
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

**Assignment Not Found (404)**

```json
{
  "status": "error",
  "error": {
    "code": "ASSIGN_001",
    "message": "Lesson not assigned to trainee"
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
    "message": "Not authorized to assign lessons"
  }
}
```

### Validation Errors

**Invalid Assignment Data (400)**

```json
{
  "status": "error",
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "lessonId": ["Invalid lesson ID"],
      "traineeEmails": ["At least one trainee email is required"],
      "dueDate": ["Due date must be in the future"]
    }
  }
}
```

**Invalid Progress Update (400)**

```json
{
  "status": "error",
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "progress": ["Progress must be between 0 and 100"],
      "status": ["Invalid status"]
    }
  }
}
```

**Invalid Trainees (400)**

```json
{
  "status": "error",
  "error": {
    "code": "USER_005",
    "message": "One or more trainee emails not found",
    "details": {
      "invalidEmails": ["nonexistent@example.com"]
    }
  }
}
```

## Integration with Questions

When a lesson is assigned to a trainee:

1. The lesson assignment is created with status "pending"
2. Individual question assignments are created for each question in the lesson
3. Progress is calculated based on completed questions:
   - Each completed question contributes to the overall lesson progress
   - Question scores affect the lesson's overall score
   - Lesson status updates based on question completion:
     - "pending": No questions attempted
     - "in_progress": Some questions attempted
     - "completed": All questions completed
     - "expired": Due date passed without completion

Example of how question progress affects lesson progress:

```json
{
  "status": "success",
  "data": {
    "assignment": {
      "_id": "507f1f77bcf86cd799439014",
      "lesson": "507f1f77bcf86cd799439013",
      "status": "in_progress",
      "progress": 60, // Calculated from question completion
      "score": 85, // Average of completed question scores
      "questionStats": {
        "total": 10,
        "completed": 6,
        "averageScore": 85,
        "highestScore": 100,
        "lowestScore": 70
      }
    }
  }
}
```
