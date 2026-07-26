import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: number;
  studentId: string;
  name: string;
  email: string;
  session?: string;
  departmentId?: number;
  departmentName?: string;
}

export interface RowError {
  rowNumber: number;
  studentId: string;
  errorMessage: string;
}

export interface BulkUploadResult {
  totalRowsProcessed: number;
  successCount: number;
  failureCount: number;
  errors: RowError[];
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private baseUrl = 'http://localhost:8080/api/v1/students';

  constructor(private http: HttpClient) {}

  getAll(departmentId?: number): Observable<Student[]> {
    let params = new HttpParams();
    if (departmentId) {
      params = params.set('departmentId', departmentId.toString());
    }
    return this.http.get<Student[]>(this.baseUrl, { params });
  }

  bulkUpload(file: File, departmentId: number): Observable<BulkUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('departmentId', departmentId.toString());
    return this.http.post<BulkUploadResult>(`${this.baseUrl}/bulk-upload`, formData);
  }

  downloadTemplate(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/excel-template`, {
      responseType: 'blob'
    });
  }
}
