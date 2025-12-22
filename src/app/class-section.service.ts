import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ClassSectionService {
 
  private classUrl = 'http://localhost:8090/api/class';
  private sectionUrl = 'http://localhost:8090/api/section';
 
  constructor(private http: HttpClient) {}
 
  private getHeaders() {
    const token = localStorage.getItem('token'); // 🔥 Matches login.component now
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      })
    };
  }
 
  // CLASS API
  createClass(data: any): Observable<any> {
    return this.http.post(this.classUrl, data, this.getHeaders());
  }
 
  updateClass(classId: number, data: any): Observable<any> {
    return this.http.put(`${this.classUrl}/${classId}`, data, this.getHeaders());
  }
 
  deleteClass(classId: number): Observable<any> {
    return this.http.delete(`${this.classUrl}/${classId}`, this.getHeaders());
  }
 
  getAllClasses(): Observable<any> {
    return this.http.get(`${this.classUrl}/fetch-all`, this.getHeaders());
  }
 
  // SECTION API
  createSection(classId: number, data: any): Observable<any> {
    return this.http.post(
      `${this.sectionUrl}/classes/${classId}/sections`,
      data,
      this.getHeaders()
    );
  }
 
  updateSection(sectionId: number, data: any): Observable<any> {
    return this.http.put(
      `${this.sectionUrl}/sections/${sectionId}`,
      data,
      this.getHeaders()
    );
  }
 
  deleteSection(sectionId: number): Observable<any> {
    return this.http.delete(
      `${this.sectionUrl}/sections/${sectionId}`,
      this.getHeaders()
    );
  }
 
  getSectionsByClass(classId: number): Observable<any> {
    return this.http.get(
      `${this.sectionUrl}/classes/${classId}/sections/fetch-all`,
      this.getHeaders()
    );
  }
}