import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeacherDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualification: string;
  experienceYears: number;
  gender: string;
  dateOfBirth: string;
  classIds?: number[];
  sectionIds?: number[];
  assignedAsClassTeacher?: boolean;
  classTeacherId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private baseUrl = 'http://localhost:8090/api/teacher';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // login नंतर token save केला असेल
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  addTeacher(teacher: TeacherDto): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.baseUrl, teacher, { headers });
  }

  getTeachers(): Observable<TeacherDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<TeacherDto[]>(this.baseUrl, { headers });
  }
}
