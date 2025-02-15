# Score Management API Responses

## Submit Answer

```http
POST /api/scores/submit
```

**Request Body**

```json
{
  "questionId": "507f1f77bcf86cd799439014",
  "answer": "Speed, Accuracy, Kindness",
  "responseTime": 42000
}
```

**Success Response (201)**

```json
{
  "status": "success",
  "data": {
    "score": {
      "_id": "507f1f77bcf86cd799439015",
      "user": "507f1f77bcf86cd799439011",
      "question": "507f1f77bcf86cd799439014",
      "lesson": "507f1f77bcf86cd799439013",
      "answer": "Speed, Accuracy, Kindness",
      "isCorrect": true,
      "points": 95,
      "responseTime": 42000,
      "createdAt": "2024-03-15T10:30:00Z"
    }
  }
}
```

## Get User Scores

```http
GET /api/scores/me
```

**Query Parameters**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `lesson` (optional): Filter by lesson ID
- `sort` (optional): Sort field and order (e.g., 'createdAt:desc')

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "scores": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "question": {
          "_id": "507f1f77bcf86cd799439014",
          "text": "What are the key principles of customer service?",
          "type": "multipleChoice"
        },
        "lesson": {
          "_id": "507f1f77bcf86cd799439013",
          "title": "Customer Service Basics"
        },
        "answer": "Speed, Accuracy, Kindness",
        "isCorrect": true,
        "points": 95,
        "responseTime": 42000,
        "createdAt": "2024-03-15T10:30:00Z"
      }
      // ... more scores
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

## Get User Performance

```http
GET /api/scores/me/performance
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "performance": {
      "totalPoints": 450,
      "totalQuestions": 5,
      "correctAnswers": 4,
      "accuracy": 80,
      "averageResponseTime": 45000,
      "byLesson": [
        {
          "lesson": {
            "_id": "507f1f77bcf86cd799439013",
            "title": "Customer Service Basics"
          },
          "totalPoints": 285,
          "totalQuestions": 3,
          "correctAnswers": 2,
          "accuracy": 66.67,
          "averageResponseTime": 48000
        }
        // ... more lesson stats
      ]
    }
  }
}
```

## View User Scores (Admin)

```http
GET /api/scores/users/:userId
```

**Query Parameters**
Same as `/api/scores/me`

**Success Response (200)**
Same format as `/api/scores/me`

## Error Responses

### Not Found

**Question Not Found (404)**

```json
{
  "success": false,
  "error": {
    "code": "QUES_001",
    "message": "Question not found"
  }
}
```

**User Not Found (404)**

```json
{
  "success": false,
  "error": {
    "code": "USER_001",
    "message": "User not found"
  }
}
```

### Authorization Errors

**Not Authorized (403)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_004",
    "message": "Not authorized to view these scores"
  }
}
```

### Validation Errors

**Invalid Answer Format (400)**

```json
{
  "success": false,
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "answer": ["Invalid answer format for multiple choice question"]
    }
  }
}
```

**Invalid Response Time (400)**

```json
{
  "success": false,
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "responseTime": ["Response time must be a positive number"]
    }
  }
}
```
