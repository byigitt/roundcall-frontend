# RoundCall - Call Center Training Platform

## Overview

RoundCall is a comprehensive call center training platform designed to help organizations train and evaluate their call center employees effectively. The platform supports various training methods including text-based learning, video lessons, and interactive assessments with real-time performance tracking.

## Core Features

### 1. User Roles and Management

- **Three-tier Role System:**

  - **Admin:** System administrators with full access
  - **Trainer:** Call center trainers who create and manage content
  - **Trainee:** Call center employees undergoing training

- **Role-specific Features:**
  - Admins can assign trainer/trainee roles
  - Trainers can manage their assigned trainees
  - Trainees can access assigned lessons and take assessments

### 2. Learning Content Types

#### Text-based Lessons

- Formatted text content
- Rich text support
- Downloadable resources

#### Video Lessons

- Video content hosting
- Video duration tracking
- Progress saving

#### Hybrid Lessons

- Combined text and video content
- Synchronized learning materials
- Interactive elements

### 3. Assessment Types

#### Multiple Choice Questions

- Traditional multiple-choice format
- Configurable number of options
- Immediate feedback

#### Text Recall Questions

- Text-based content display
- Timed display duration (configurable)
- Response time tracking
- Performance metrics

#### Video-based Questions

- Questions tied to specific video timestamps
- Video segment recall
- Comprehension assessment

#### Timed Text Questions

- Configurable display duration
- Reaction time measurement
- Performance scoring

### 4. Training Management

#### Content Management

- Lesson creation and organization
- Question bank management
- Content categorization

#### Assignment System

- Assign lessons to trainees
- Set due dates
- Track completion status

#### Attempt Management

- Configurable attempt limits
- Progress tracking
- Performance history

### 5. Performance Analytics

#### Trainee Dashboard

- Personal progress tracking
- Performance metrics
- Improvement suggestions

#### Trainer Dashboard

- Trainee performance overview
- Group analytics
- Progress reports

#### Analytics Metrics

- Response times
- Accuracy rates
- Completion rates
- Trend analysis

## Technical Implementation

### Backend Architecture

- Node.js with Express
- MongoDB database
- JWT authentication
- Role-based access control

### Frontend Requirements

- React-based SPA
- Real-time updates
- Responsive design
- Video player integration
- Timer implementations
- Performance optimization

## API Integration

### Authentication Endpoints

- User registration
- Login/logout
- Role management

### Content Management Endpoints

- Lesson CRUD operations
- Question management
- Assignment handling

### Assessment Endpoints

- Question submission
- Response timing
- Score calculation

### Analytics Endpoints

- Performance data
- Progress tracking
- Report generation

## Data Models

### User Model

```typescript
{
  role: 'admin' | 'trainer' | 'trainee'
  assignedTrainer?: ObjectId
  trainees?: ObjectId[]
  // ... other user fields
}
```

### Lesson Model

```typescript
{
  contentType: 'text' | 'video' | 'both'
  textContent?: string
  videoUrl?: string
  duration?: number
  // ... other lesson fields
}
```

### Question Model

```typescript
{
  type: 'multipleChoice' | 'textRecall' | 'videoRecall' | 'timedText'
  displayTime?: number  // for timed questions
  maxAttempts: number
  videoTimestamp?: number
  // ... other question fields
}
```

### AssignedQuestion Model

```typescript
{
  trainee: ObjectId
  question: ObjectId
  attemptCount: number
  reactionTime?: number
  score: number
  // ... other assignment fields
}
```

## Frontend Implementation Guidelines

### Required Components

1. **Authentication System**

   - Login/Register forms
   - Role-based routing
   - Session management

2. **Content Display**

   - Text content renderer
   - Video player integration
   - Timed content display

3. **Question Components**

   - Multiple choice renderer
   - Timed text display
   - Video-based question handler
   - Response timer

4. **Dashboard Components**
   - Trainee progress view
   - Trainer overview
   - Analytics displays

### User Experience Requirements

1. **Content Interaction**

   - Smooth video playback
   - Clear text display
   - Intuitive navigation

2. **Assessment Experience**

   - Clear question presentation
   - Accurate timing system
   - Immediate feedback

3. **Performance Tracking**
   - Real-time progress updates
   - Clear performance metrics
   - Intuitive analytics display

## Security Considerations

1. **Authentication**

   - JWT token management
   - Role-based access control
   - Session handling

2. **Data Protection**

   - Secure API endpoints
   - Data encryption
   - Input validation

3. **Content Security**
   - Protected video streams
   - Secure content delivery
   - Access control

## Development Workflow

1. **Setup**

   - Environment configuration
   - Database setup
   - API integration

2. **Implementation**

   - Component development
   - API integration
   - Testing and validation

3. **Deployment**
   - Build optimization
   - Performance testing
   - Monitoring setup

## Getting Started

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Run development server
5. Begin implementation

For detailed API documentation, refer to the [API Documentation](./api/endpoints.md).
