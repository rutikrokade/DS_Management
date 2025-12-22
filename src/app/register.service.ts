import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class registerService {

  private baseUrl = 'http://localhost:8090/api/user';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ⭐ REGISTER — ADMIN TOKEN REQUIRED
  registerUser(data: any): Observable<any> {
    const headers = this.getAuthHeader().set('Content-Type', 'application/json');
    return this.http.post(`${this.baseUrl}/create`, data, { headers });
  }

  // ⭐ GET ALL USERS
  getAllUsers(): Observable<any> {
    const headers = this.getAuthHeader();
    return this.http.get(`${this.baseUrl}/all`, { headers });
  }

  // ⭐ UPDATE STATUS
  updateStatus(id: number, status: string, approved: boolean): Observable<any> {
    const headers = this.getAuthHeader().set('Content-Type', 'application/json');
    const body = { status, approved };
    return this.http.put(`${this.baseUrl}/status/${id}`, body, { headers });
  }

  // 🔥 SINGLE SOURCE OF TOKEN
  private getAuthHeader(): HttpHeaders {
    let headers = new HttpHeaders();

    if (this.isBrowser()) {
      const token = localStorage.getItem('token'); // ✅ FIXED
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
