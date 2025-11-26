import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class AdminService {
 
  private baseUrl = 'http://localhost:8090/api/auth';
 
  constructor(private http: HttpClient) {}
 
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }
}