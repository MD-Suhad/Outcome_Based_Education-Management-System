import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AiAnalysisRequest {
  syllabusText: string;
  courseCode?: string;
  programCode?: string;
}

export interface CoPoRecommendation {
  coCode: string;
  coStatement: string;
  bloomsTaxonomy: string;
  recommendedPlo: string;
  recommendedWeight: number;
  confidenceScore: number;
  rationale: string;
}

export interface AiAnalysisResponse {
  courseCode: string;
  totalOutcomesProcessed: number;
  suggestions: CoPoRecommendation[];
  status: string;
  modelUsed: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl || 'http://localhost:8080'}/api/v1/ai`;

  analyzeSyllabus(payload: AiAnalysisRequest): Observable<AiAnalysisResponse> {
    return this.http.post<AiAnalysisResponse>(`${this.apiUrl}/analyze-syllabus`, payload);
  }
}
