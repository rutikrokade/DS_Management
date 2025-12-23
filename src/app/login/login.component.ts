import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
goHome() {
this.router.navigate(['/home']); 
}

  loginForm!: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  

  login() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const payload = {
    username: this.loginForm.value.email,
    password: this.loginForm.value.password
  };

  this.authService.login(payload).subscribe({
    next: (res: any) => {

      // save token & role
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.role);

      // ✅ ROLE-WISE DASHBOARD REDIRECT
      switch (res.role) {
        case 'ADMIN':
          this.router.navigate(['/admin']);
          break;

        case 'TEACHER':
          this.router.navigate(['/teacher']);
          break;

        case 'STUDENT':
          this.router.navigate(['/student']);
          break;

        case 'PARENT':
          this.router.navigate(['/parent']);
          break;

        default:
          this.router.navigate(['/login']);
      }
    },
    error: () => {
      alert('Invalid Credentials');
    }
  });
}
}