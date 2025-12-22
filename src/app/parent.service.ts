import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParentService {

  private baseUrl = 'http://localhost:8090/api/admin/parents';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private headers(): HttpHeaders {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      });
    }
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // CREATE
  createParent(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data, { headers: this.headers() });
  }

  // UPDATE
  updateParent(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, { headers: this.headers() });
  }

  // DELETE
  deleteParent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.headers() });
  }

  // LIST
  getAllParents(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.headers() });
  }

  // LINK STUDENT
  linkParentStudent(parentId: number, studentId: number, relationship: string) {
    return this.http.post(
      `${this.baseUrl}/link?parentId=${parentId}&studentId=${studentId}&relationship=${relationship}`,
      {},
      { headers: this.headers() }
    );
  }
}
