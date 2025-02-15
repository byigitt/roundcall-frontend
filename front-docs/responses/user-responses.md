# User Management API Responses

## List Users (Admin Only)

```http
GET /api/users
```

**Query Parameters**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `role` (optional): Filter by role ('admin', 'trainer', 'trainee')
- `department` (optional): Filter by department
- `search` (optional): Search in username, email, firstName, lastName
- `sort` (optional): Sort field and order (e.g., 'createdAt:desc')

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "department": "Sales",
        "role": "trainee",
        "isActive": true,
        "lastLogin": "2024-03-15T10:30:00Z",
        "createdAt": "2024-03-15T10:00:00Z",
        "updatedAt": "2024-03-15T10:30:00Z"
      }
      // ... more users
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "hasMore": true
  }
}
```

## Get User by ID

```http
GET /api/users/:id
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "department": "Sales",
      "role": "trainee",
      "isActive": true,
      "lastLogin": "2024-03-15T10:30:00Z",
      "createdAt": "2024-03-15T10:00:00Z",
      "updatedAt": "2024-03-15T10:30:00Z"
    }
  }
}
```

## Update User

```http
PUT /api/users/:id
```

**Request Body**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "department": "Training"
}
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "department": "Training",
      "role": "trainee",
      "isActive": true,
      "lastLogin": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-15T10:35:00Z"
    }
  }
}
```

## Delete User

```http
DELETE /api/users/:id
```

**Success Response (204)**

```json
{
  "status": "success",
  "data": null
}
```

## Error Responses

### Not Found

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
    "message": "Not authorized to access this profile"
  }
}
```

### Validation Errors

**Invalid Update Data (400)**

```json
{
  "success": false,
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "firstName": [
        "First name must contain only letters, spaces, and hyphens"
      ],
      "lastName": ["Last name must contain only letters, spaces, and hyphens"]
    }
  }
}
```

**Email Already Exists (400)**

```json
{
  "success": false,
  "error": {
    "code": "USER_002",
    "message": "Email already in use"
  }
}
```

**Username Already Exists (400)**

```json
{
  "success": false,
  "error": {
    "code": "USER_003",
    "message": "Username already taken"
  }
}
```

## Assign Trainer to Trainee (Admin Only)

```http
POST /api/users/:traineeId/assign-trainer
```

**Request Body**

```json
{
  "trainerId": "507f1f77bcf86cd799439012"
}
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "trainee",
      "assignedTrainer": "507f1f77bcf86cd799439012",
      "updatedAt": "2024-03-15T10:30:00Z"
    }
  }
}
```

**Error Responses**

```json
{
  "status": "error",
  "error": {
    "code": "USER_004",
    "message": "User not found"
  }
}
```

```json
{
  "status": "error",
  "error": {
    "code": "USER_005",
    "message": "Invalid trainer assignment"
  }
}
```

## Get My Trainees (Trainer Only)

```http
GET /api/users/my-trainees
```

**Query Parameters**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in trainee name or email
- `sort` (optional): Sort field and order (e.g., 'createdAt:desc')

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
        "progress": {
          "completedLessons": 5,
          "totalLessons": 10,
          "averageScore": 85,
          "lastActivity": "2024-03-15T10:30:00Z"
        },
        "createdAt": "2024-03-15T10:00:00Z",
        "updatedAt": "2024-03-15T10:30:00Z"
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

## Get Trainee Details (Trainer Only)

```http
GET /api/users/trainee/:traineeId/details
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "trainee": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "trainee",
      "progress": {
        "completedLessons": 5,
        "totalLessons": 10,
        "averageScore": 85,
        "lastActivity": "2024-03-15T10:30:00Z",
        "performance": {
          "reactionTimes": {
            "average": 2.5,
            "best": 1.8,
            "worst": 4.2
          },
          "accuracy": {
            "overall": 85,
            "byDifficulty": {
              "easy": 90,
              "medium": 85,
              "hard": 75
            }
          },
          "completionRate": 80
        }
      },
      "createdAt": "2024-03-15T10:00:00Z",
      "updatedAt": "2024-03-15T10:30:00Z"
    }
  }
}
```

**Error Response**

```json
{
  "status": "error",
  "error": {
    "code": "USER_006",
    "message": "Trainee not found or not authorized"
  }
}
```
