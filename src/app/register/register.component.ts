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

  constructor(private fb: FormBuilder, private registerService: registerService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
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

    this.registerService.registerUser(this.registerForm.value).subscribe(
      (res: any) => {
        alert("User Created Successfully!");
        console.log(res);
        this.registerForm.reset();
      },
      (error: any) => {
        alert("Something went wrong!");
        console.error(error);
      }
    );
  }
}
