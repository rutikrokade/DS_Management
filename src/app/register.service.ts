import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class registerService {

  private baseUrl = 'http://localhost:8090/api/user';

  constructor(private http: HttpClient) {}

  // REGISTER
  registerUser(data: any) {
    const headers = this.getAuthHeader();
    return this.http.post(`${this.baseUrl}/create`, data, { headers });
  }

  // GET ALL USERS
  getAllUsers() {
    const headers = this.getAuthHeader();
    return this.http.get(`${this.baseUrl}/all`, { headers });
  }

  // UPDATE STATUS → APPROVED / REJECTED
  updateStatus(id: number, status: string) {
    const headers = this.getAuthHeader();
    const body = { status: status };

    // ⭐ MOST IMPORTANT FIX → responseType: 'text'
    return this.http.put(
      `${this.baseUrl}/status/${id}`,
      body,
      { headers, responseType: 'text' }
    );
  }

  // COMMON TOKEN HEADER
  private getAuthHeader() {
    const token = localStorage.getItem('adminToken');

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
