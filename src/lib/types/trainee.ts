export interface Trainee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  lessons: {
    _id: string;
    lesson: {
      _id: string;
      title: string;
      contentType: string;
      difficulty: string;
    };
    status: 'pending' | 'in_progress' | 'completed' | 'expired';
    progress: number;
    startedAt: string;
    lastAccessedAt: string;
    dueDate?: string;
  }[];
  stats: {
    totalAssigned: number;
    completed: number;
    inProgress: number;
    pending: number;
    expired: number;
    averageProgress: number;
  };
  lastActivity: string;
  totalAssignedLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  notStartedLessons: number;
  completionRate: number;
  assignedLessons: {
    id: string;
    lessonID: string;
    status: string;
    progress: number;
    assignedAt: string;
    completedAt?: string;
    lesson?: {
      title: string;
      description: string;
      contentType: string;
    };
  }[];
} 