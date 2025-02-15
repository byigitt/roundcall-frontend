# Question Management API Responses

## Create Single Question

```http
POST /api/questions
```

**Request Body**

```json
{
  "text": "What are the key principles of active listening?",
  "type": "multipleChoice",
  "options": [
    "Focus, Understand, Respond",
    "Listen, Nod, Speak",
    "Hear, Think, React",
    "Record, Repeat, Reply"
  ],
  "correctAnswer": 0,
  "difficulty": "medium",
  "points": 10,
  "maxAttempts": 2
}
```

OR

```json
{
  "text": "Explain the importance of empathy in customer service.",
  "type": "textRecall",
  "correctAnswer": "Empathy helps understand customer needs and build trust",
  "difficulty": "medium",
  "points": 15,
  "maxAttempts": -1
}
```

OR

```json
{
  "text": "Read and recall the following customer service guideline.",
  "type": "timedText",
  "correctAnswer": "Always greet customers with a smile and positive attitude",
  "displayTime": 10000,
  "difficulty": "easy",
  "points": 10,
  "maxAttempts": 3
}
```

OR

```json
{
  "text": "What did the customer say at this point in the video?",
  "type": "videoRecall",
  "correctAnswer": "I've been waiting for 30 minutes",
  "videoTimestamp": 125,
  "difficulty": "hard",
  "points": 20,
  "maxAttempts": 2
}
```

**Success Response (201)**

```json
{
  "status": "success",
  "data": {
    "question": {
      "_id": "507f1f77bcf86cd799439014",
      "text": "What are the key principles of active listening?",
      "type": "multipleChoice",
      "options": [
        "Focus, Understand, Respond",
        "Listen, Nod, Speak",
        "Hear, Think, React",
        "Record, Repeat, Reply"
      ],
      "correctAnswer": 0,
      "difficulty": "medium",
      "points": 10,
      "maxAttempts": 2,
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
      "createdAt": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-15T10:30:00Z"
    }
  }
}
```

## Create Multiple Questions (Batch)

```http
POST /api/questions/batch
```

**Request Body**

```json
{
  "type": "multipleChoice",
  "questions": [
    {
      "text": "What is the first step in handling a customer complaint?",
      "options": [
        "Listen actively",
        "Offer a solution",
        "Apologize",
        "Take notes"
      ],
      "correctAnswer": 0,
      "difficulty": "easy",
      "points": 10,
      "maxAttempts": 2
    },
    {
      "text": "Which response shows the best empathy?",
      "options": [
        "I understand your frustration",
        "Please calm down",
        "That's not our fault",
        "Let me check the policy"
      ],
      "correctAnswer": 0,
      "difficulty": "medium",
      "points": 15,
      "maxAttempts": 2
    }
  ]
}
```

**Success Response (201)**

```json
{
  "status": "success",
  "data": {
    "questions": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "text": "What is the first step in handling a customer complaint?",
        "type": "multipleChoice",
        "options": [
          "Listen actively",
          "Offer a solution",
          "Apologize",
          "Take notes"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "points": 10,
        "maxAttempts": 2,
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
        "createdAt": "2024-03-15T10:30:00Z",
        "updatedAt": "2024-03-15T10:30:00Z"
      }
      // ... more questions
    ]
  }
}
```

## Get All Questions

```http
GET /api/questions
```

**Query Parameters**

- `type` (optional): Filter by question type
- `difficulty` (optional): Filter by difficulty level

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "questions": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "text": "What are the key principles of active listening?",
        "type": "multipleChoice",
        "options": [
          "Focus, Understand, Respond",
          "Listen, Nod, Speak",
          "Hear, Think, React",
          "Record, Repeat, Reply"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "points": 10,
        "maxAttempts": 2,
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
        "createdAt": "2024-03-15T10:30:00Z",
        "updatedAt": "2024-03-15T10:30:00Z"
      }
      // ... more questions
    ]
  },
  "results": 10
}
```

## Get Single Question

```http
GET /api/questions/:id
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "question": {
      "_id": "507f1f77bcf86cd799439014",
      "text": "What are the key principles of active listening?",
      "type": "multipleChoice",
      "options": [
        "Focus, Understand, Respond",
        "Listen, Nod, Speak",
        "Hear, Think, React",
        "Record, Repeat, Reply"
      ],
      "correctAnswer": 0,
      "difficulty": "medium",
      "points": 10,
      "maxAttempts": 2,
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
      "createdAt": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-15T10:30:00Z"
    }
  }
}
```

## Update Question

```http
PATCH /api/questions/:id
```

**Request Body**

```json
{
  "text": "Updated question text",
  "options": [
    "Updated option 1",
    "Updated option 2",
    "Updated option 3",
    "Updated option 4"
  ],
  "correctAnswer": 1,
  "difficulty": "hard",
  "points": 20
}
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "question": {
      "_id": "507f1f77bcf86cd799439014",
      "text": "Updated question text",
      "type": "multipleChoice",
      "options": [
        "Updated option 1",
        "Updated option 2",
        "Updated option 3",
        "Updated option 4"
      ],
      "correctAnswer": 1,
      "difficulty": "hard",
      "points": 20,
      "maxAttempts": 2,
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
      "createdAt": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-15T11:00:00Z"
    }
  }
}
```

## Delete Question

```http
DELETE /api/questions/:id
```

**Success Response (204)**

```json
{
  "status": "success",
  "data": null
}
```

## Error Responses

### Not Found (404)

```json
{
  "status": "error",
  "error": {
    "code": "QUES_001",
    "message": "Question not found"
  }
}
```

### Already Assigned (400)

```json
{
  "status": "error",
  "error": {
    "code": "QUES_002",
    "message": "Cannot update a question that is already assigned"
  }
}
```

### Validation Error (400)

```json
{
  "status": "error",
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "text": ["Question text must be at least 10 characters long"],
      "type": ["Invalid question type"],
      "options": ["Multiple choice questions must have at least 2 options"],
      "correctAnswer": ["Invalid correct answer format"],
      "difficulty": ["Difficulty must be either easy, medium, or hard"],
      "points": ["Points must be between 1 and 100"]
    }
  }
}
```

### Authorization Error (403)

```json
{
  "status": "error",
  "error": {
    "code": "AUTH_004",
    "message": "Not authorized to perform this action"
  }
}
```
