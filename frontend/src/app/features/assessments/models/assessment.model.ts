export interface Assessment {
  id: number;
  courseId: number;
  name: string;
  description?: string;
  type: 'exam' | 'assignment' | 'quiz' | 'project' | 'portfolio';
  totalPoints: number;
  dueDate?: string;
  publishedDate?: string;
  status: 'draft' | 'published' | 'closed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentDetail extends Assessment {
  questions?: AssessmentQuestion[];
  submissions?: AssessmentSubmission[];
}

export interface AssessmentQuestion {
  id: number;
  assessmentId: number;
  questionNumber: number;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'true-false';
  questionText: string;
  points: number;
  options?: QuestionOption[];
  correctAnswer?: string;
}

export interface QuestionOption {
  id: number;
  optionText: string;
  isCorrect: boolean;
}

export interface AssessmentSubmission {
  id: number;
  assessmentId: number;
  studentId: number;
  studentName: string;
  submittedAt: string;
  gradeId?: number;
  status: 'pending' | 'submitted' | 'graded';
}

export interface AssessmentResponse {
  id: number;
  submissionId: number;
  questionId: number;
  studentAnswer: string;
  points?: number;
  feedback?: string;
}

export interface AssessmentFilter {
  searchTerm?: string;
  courseId?: number;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}
