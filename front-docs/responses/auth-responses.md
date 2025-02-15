# Authentication API Responses

## Register User

```http
POST /api/auth/register
```

**Request Body**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "department": "Sales"
}
```

**Success Response (201)**

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
      "createdAt": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

## Login

```http
POST /api/auth/login
```

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

OR

```json
{
  "username": "john_doe",
  "password": "Password123!"
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
      "department": "Sales",
      "role": "trainee",
      "isActive": true,
      "lastLogin": "2024-03-15T10:30:00Z",
      "createdAt": "2024-03-15T10:00:00Z",
      "updatedAt": "2024-03-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

## Get Current User

```http
GET /api/auth/me
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

## Refresh Token

```http
POST /api/auth/refresh-token
```

**Request Body**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

## Logout

```http
POST /api/auth/logout
```

**Success Response (200)**

```json
{
  "status": "success",
  "data": null
}
```

## Request Password Reset

```http
POST /api/auth/password/reset-request
```

**Request Body**

```json
{
  "email": "john@example.com"
}
```

**Success Response (200)**

```json
{
  "status": "success",
  "message": "Token sent to email",
  "data": {
    "resetToken": "a1b2c3d4e5f6..." // Only in development
  }
}
```

## Reset Password

```http
POST /api/auth/password/reset
```

**Request Body**

```json
{
  "token": "a1b2c3d4e5f6...",
  "password": "NewPassword123!"
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
      "department": "Sales",
      "role": "trainee",
      "isActive": true,
      "lastLogin": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

## Change Password

```http
POST /api/auth/password/change
```

**Request Body**

```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
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
      "department": "Sales",
      "role": "trainee",
      "isActive": true,
      "lastLogin": "2024-03-15T10:30:00Z",
      "updatedAt": "2024-03-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

## Error Responses

### Authentication Errors

**Invalid Credentials (401)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Incorrect email/username or password"
  }
}
```

**Token Expired (401)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_002",
    "message": "Your token has expired. Please log in again."
  }
}
```

**Invalid Token (401)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_003",
    "message": "Invalid token. Please log in again."
  }
}
```

### Account Errors

**Account Locked (403)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_006",
    "message": "Account is locked. Please try again in 15 minutes"
  }
}
```

**Password Reset Token Invalid (400)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_005",
    "message": "Token is invalid or has expired"
  }
}
```

### Rate Limiting

**Too Many Attempts (429)**

```json
{
  "success": false,
  "error": {
    "code": "RATE_001",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 900
    }
  }
}
```

### Validation Errors

**Invalid Input (400)**

```json
{
  "success": false,
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": {
      "password": [
        "Password must be at least 8 characters long",
        "Password must contain at least one uppercase letter",
        "Password must contain at least one number",
        "Password must contain at least one special character"
      ]
    }
  }
}
```
