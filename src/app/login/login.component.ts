import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 
  showPassword = false;
 
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {}
 
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
 
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
 
  // ✅ CROSS BUTTON FUNCTION
  goHome() {
    this.router.navigate(['/']);
  }
 
  onSubmit() {
    if (this.loginForm.invalid) return;
 
    this.adminService.login(this.loginForm.value).subscribe({
      next: (res) => {
        alert("Login Successful");
 
        if (res.token) {
          localStorage.setItem("adminToken", res.token);
        }
 
        this.router.navigate(['/admin']);
      },
      error: () => {
        alert("Invalid Username or Password");
      }
    });
  }
}