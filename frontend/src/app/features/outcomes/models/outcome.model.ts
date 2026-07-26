export interface ProgramOutcome {
  id: number;
  programId: number;
  code: string;
  description: string;
  level: number;
  type: 'knowledge' | 'skill' | 'attitude' | 'competency';
  rubric?: OutcomeRubric;
  assessmentMethods: string[];
  targetAchievementRate?: number;
  actualAchievementRate?: number;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface OutcomeRubric {
  id: number;
  outcomeId: number;
  name: string;
  criteria: RubricCriterion[];
  scale: number; // 1-4 or 1-5, etc.
}

export interface RubricCriterion {
  id: number;
  name: string;
  description: string;
  levels: RubricLevel[];
}

export interface RubricLevel {
  score: number;
  label: string;
  description: string;
}

export interface CourseOutcome {
  id: number;
  courseId: number;
  programOutcomeId: number;
  courseOutcomeCode: string;
  description?: string;
  weight: number; // 0-100 for assessment weight
  mappedProgramOutcome: ProgramOutcome;
}

export interface OutcomeMapping {
  id: number;
  courseId: number;
  courseOutcomeId: number;
  programOutcomeId: number;
  alignmentStrength: 'strong' | 'moderate' | 'weak';
  notes?: string;
}

export interface OutcomeFilter {
  searchTerm?: string;
  programId?: number;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}
