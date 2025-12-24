import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { registerService } from '../register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls:['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  roles = ['ADMIN', 'PARENT', 'TEACHER', 'STUDENT'];

  // 👁 password toggle (ONLY ONCE)
  showPassword = false;

  // 🔥 popup
  showPopup = false;
  popupMessage = '';

  constructor(
    private fb: FormBuilder,
    private registerService: registerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  // 👁 SHOW / HIDE PASSWORD
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // ❌ CROSS BUTTON → STATUS PAGE
  goStatus() {
    this.router.navigate(['/status']);
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.registerForm.value,
      username: this.registerForm.value.email
    };

    console.log('REGISTER PAYLOAD 👉', payload);

    this.registerService.registerUser(payload).subscribe({
      next: () => {
        this.popupMessage = '✅ User created successfully! Please wait for admin approval.';
        this.showPopup = true;
        this.registerForm.reset();

        setTimeout(() => this.showPopup = false, 3000);
      },
      error: (error) => {
        this.popupMessage = '❌ Registration failed. Try again.';
        this.showPopup = true;

        setTimeout(() => this.showPopup = false, 3000);
        console.error('Registration failed', error);
      }
    });
  }
}
