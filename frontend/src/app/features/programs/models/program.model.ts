export interface Program {
  id: number;
  code: string;
  name: string;
  description?: string;
  department: string;
  degreeLevel: 'associate' | 'bachelor' | 'master' | 'phd';
  totalCredits?: number;
  status: 'active' | 'inactive' | 'archived';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramDetail extends Program {
  outcomes: ProgramOutcome[];
  courses: ProgramCourse[];
  students?: number;
}

export interface ProgramOutcome {
  id: number;
  code: string;
  description: string;
  level: number;
  type: 'knowledge' | 'skill' | 'attitude';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface ProgramCourse {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  credits: number;
  isRequired: boolean;
  semester: number;
}

export interface ProgramFilter {
  searchTerm?: string;
  department?: string;
  degreeLevel?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}
