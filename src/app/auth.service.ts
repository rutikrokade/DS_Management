import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
 
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
 
  constructor(private router: Router) {}
 
  canActivate(): boolean {
    const token = localStorage.getItem('adminToken');
 
    if (!token) {
      this.router.navigate(['/admin/login']);
      return false;
    }
 
    return true;
  }
}
 