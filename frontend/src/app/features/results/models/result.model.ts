export interface Result {
  id: number;
  assessmentId: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  submittedAt: string;
  gradedAt?: string;
  score: number;
  totalPoints: number;
  percentage: number;
  grade?: string;
  feedback?: string;
  status: 'pending' | 'graded' | 'released';
}

export interface DetailedResult extends Result {
  responses: ResultResponse[];
  outcomeAchievements: OutcomeAchievement[];
}

export interface ResultResponse {
  id: number;
  resultId: number;
  questionId: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer?: string;
  points: number;
  maxPoints: number;
  feedback?: string;
  isCorrect: boolean;
}

export interface OutcomeAchievement {
  id: number;
  resultId: number;
  courseOutcomeId: number;
  outcomeCode: string;
  outcomeDescription: string;
  achievedLevel: number; // 0-4 scale based on rubric
  maxLevel: number;
  percentageAchieved: number;
}

export interface AggregateResult {
  courseId: number;
  courseName: string;
  assessmentId: number;
  assessmentName: string;
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  outcomeAchievementRates: OutcomeAchievementRate[];
}

export interface OutcomeAchievementRate {
  outcomeCode: string;
  outcomeDescription: string;
  averageAchievementLevel: number;
  percentageMetTarget: number;
  targetAchievementRate: number;
}

export interface ResultFilter {
  searchTerm?: string;
  courseId?: number;
  assessmentId?: number;
  studentId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}
