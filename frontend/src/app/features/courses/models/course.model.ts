export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  description?: string;
  credits: number;
  department: string;
  semester: string;
  instructor?: string;
  instructorId?: number;
  capacity?: number;
  enrolled?: number;
  status: 'active' | 'inactive' | 'archived';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetail extends Course {
  outcomes?: CourseOutcome[];
  students?: CourseStudent[];
  assessments?: Assessment[];
}

export interface CourseOutcome {
  id: number;
  outcomeCode: string;
  description: string;
  mappedOutcome?: ProgramOutcome;
}

export interface CourseStudent {
  id: number;
  studentId: number;
  studentName: string;
  email: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'completed';
}

export interface CourseFilter {
  searchTerm?: string;
  department?: string;
  semester?: string;
  status?: string;
  instructorId?: number;
  page?: number;
  pageSize?: number;
}

export interface Assessment {
  id: number;
  courseId: number;
  name: string;
  description?: string;
  type: 'exam' | 'assignment' | 'quiz' | 'project';
  totalPoints: number;
  dueDate?: string;
  createdAt: string;
}

export interface ProgramOutcome {
  id: number;
  code: string;
  description: string;
}
