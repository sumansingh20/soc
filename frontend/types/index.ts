// User types
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Course types
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  instructorId: string;
  thumbnailUrl?: string;
  durationHours: number;
  lessonsCount: number;
  rating: number;
  isPublished: boolean;
  isPremium: boolean;
  price: number;
  studentsCount: number;
  prerequisites?: string;
  learningOutcomes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  content: string;
  videoUrl?: string;
  orderIndex: number;
  durationMinutes: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Lab types
export interface Lab {
  id: string;
  title: string;
  slug: string;
  description: string;
  objectives: string;
  scenario: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  tags: string[];
  estimatedTimeMinutes: number;
  instructions: string;
  expectedFindings: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LabSubmission {
  id: string;
  userId: string;
  labId: string;
  submissionData: Record<string, any>;
  findings: string;
  report: string;
  score?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
  status: 'pending' | 'reviewed' | 'approved';
}

// Progress types
export interface UserProgress {
  id: string;
  userId: string;
  courseId?: string;
  lessonId?: string;
  labId?: string;
  progressPercentage: number;
  completedAt?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  quizScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Certificate types
export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issueDate: string;
  expiryDate?: string;
  certificateCode: string;
  isValid: boolean;
  courseTitle: string;
}

// Challenge types
export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  points: number;
  category: string;
  tags: string[];
  hint?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export interface DashboardStats {
  coursesEnrolled: number;
  avgProgress: number;
  completedCourses: number;
}

export interface DashboardData {
  stats: DashboardStats;
  courses: UserProgress[];
  recentActivity: any[];
}

// API Response types
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
