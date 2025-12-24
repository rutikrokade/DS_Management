import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExamService {

  // ================= BASE URLS =================
  private examApi = 'http://localhost:8090/api/admin/exams';
  private classApi = 'http://localhost:8090/api/class';
  private sectionApi = 'http://localhost:8090/api/section';
  private subjectApi = 'http://localhost:8090/api/admin/subjects';

  constructor(private http: HttpClient) {}

  // ================= EXAMS =================
  createExam(payload: any): Observable<any> {
    return this.http.post(this.examApi, payload);
  }

  updateExam(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.examApi}/${id}`, payload);
  }

  deleteExam(id: number): Observable<any> {
    return this.http.delete(`${this.examApi}/${id}`, {
      responseType: 'text'
    });
  }

  getExams(filters: any = {}): Observable<any[]> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get<any[]>(this.examApi, { params });
  }

  // ================= CLASSES =================
  getClasses(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.classApi}/fetch-all`
    );
  }

  // ================= SECTIONS =================
  getSectionsByClass(classId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.sectionApi}/classes/${classId}/sections/fetch-all`
    );
  }

  // ================= SUBJECTS =================
  getSubjects(): Observable<any[]> {
    return this.http.get<any[]>(
      this.subjectApi
    );
  }

}
