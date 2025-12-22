import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
export interface TeacherCreateRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  qualification: string;
  gender: string;
  dateOfBirth: string;
  assignedClasses?: string;
  experienceYears?: number;
}
 
 
export interface TeacherDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualification: string;
  experienceYears: number;
  gender: string;
  dateOfBirth: string;
}
 
@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private baseUrl = 'http://localhost:8090/api/teacher';
 
  constructor(private http: HttpClient) {}
 
  createTeacher(request: TeacherCreateRequest): Observable<TeacherDto> {
    return this.http.post<TeacherDto>(this.baseUrl, request);
  }
}
 