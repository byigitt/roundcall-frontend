# Trainee Management API Responses

## Get Trainees with Lesson Assignments

```http
GET /api/users/my-trainees/lessons
```

**Query Parameters**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in trainee name or email
- `status` (optional): Filter by lesson status ('pending', 'in_progress', 'completed', 'expired')
- `sort` (optional): Sort field and order (e.g., 'lastActivity:desc', 'stats.completed:desc')

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "trainees": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "trainee",
        "lessons": [
          {
            "_id": "507f1f77bcf86cd799439013",
            "lesson": {
              "_id": "507f1f77bcf86cd799439014",
              "title": "Quick Response Training",
              "contentType": "timed_text",
              "difficulty": "intermediate"
            },
            "status": "in_progress",
            "progress": 60,
            "startedAt": "2024-02-15T10:35:00Z",
            "lastAccessedAt": "2024-02-15T15:45:00Z",
            "dueDate": "2024-03-01T00:00:00Z"
          }
          // ... more lessons
        ],
        "stats": {
          "totalAssigned": 5,
          "completed": 2,
          "inProgress": 1,
          "pending": 1,
          "expired": 1,
          "averageProgress": 45
        },
        "lastActivity": "2024-02-15T15:45:00Z"
      }
      // ... more trainees
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

## Error Responses

### Not Found

**Trainee Not Found (404)**

```json
{
  "status": "error",
  "error": {
    "code": "USER_001",
    "message": "Trainee not found"
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
    "message": "Not authorized to view trainees"
  }
}
```

### Validation Errors

**Invalid Query Parameters (400)**

```json
{
  "status": "error",
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "status": ["Invalid status value"],
      "page": ["Page must be a positive number"],
      "limit": ["Limit must be between 1 and 100"]
    }
  }
}
```
