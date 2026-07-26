import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Department {
  id?: number;
  name: string;
  code: string;
  facultyId?: number;
  facultyName?: string;
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private baseUrl = 'http://localhost:8080/api/v1/departments';

  constructor(private http: HttpClient) {}

  getAll(facultyId?: number): Observable<Department[]> {
    let params = new HttpParams();
    if (facultyId) {
      params = params.set('facultyId', facultyId.toString());
    }
    return this.http.get<Department[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/${id}`);
  }

  create(department: Department): Observable<Department> {
    return this.http.post<Department>(this.baseUrl, department);
  }

  update(id: number, department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.baseUrl}/${id}`, department);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
