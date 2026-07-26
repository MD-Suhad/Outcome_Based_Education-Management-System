import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Faculty {
  id?: number;
  name: string;
  code: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class FacultyService {
  private baseUrl = 'http://localhost:8080/api/v1/faculties';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.baseUrl);
  }

  getById(id: number): Observable<Faculty> {
    return this.http.get<Faculty>(`${this.baseUrl}/${id}`);
  }

  create(faculty: Faculty): Observable<Faculty> {
    return this.http.post<Faculty>(this.baseUrl, faculty);
  }

  update(id: number, faculty: Faculty): Observable<Faculty> {
    return this.http.put<Faculty>(`${this.baseUrl}/${id}`, faculty);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
