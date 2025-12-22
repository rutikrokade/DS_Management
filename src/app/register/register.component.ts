import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { registerService } from '../register.service';
import { HttpClientModule } from '@angular/common/http';
 
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],  // ⭐ REQUIRED
  templateUrl: './register.component.html'
  
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  roles = ['ADMIN', 'PARENT', 'TEACHER', 'STUDENT'];

  // 🔥 popup states
  showPopup = false;
  popupMessage = '';

  constructor(
    private fb: FormBuilder,
    private registerService: registerService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
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

        // ⏱️ auto close after 3 sec
        setTimeout(() => {
          this.showPopup = false;
        }, 3000);
      },
      error: (error) => {
        this.popupMessage = '❌ Registration failed. Try again.';
        this.showPopup = true;

        setTimeout(() => {
          this.showPopup = false;
        }, 3000);

        console.error('Registration failed', error);
      }
    });
  }
}
