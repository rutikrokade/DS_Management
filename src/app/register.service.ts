import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class registerService {

  private baseUrl = 'http://localhost:8090/api/user/create';

  constructor(private http: HttpClient) {}

  registerUser(data: any) {

    const token = localStorage.getItem('adminToken'); // ⭐ GET token

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`   // ⭐ SEND token
    });

    return this.http.post(this.baseUrl, data, { headers });
  }
}
