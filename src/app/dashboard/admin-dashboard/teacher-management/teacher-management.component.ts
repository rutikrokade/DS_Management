import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../teacher.service';

@Component({
  selector: 'app-teacher-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './teacher-management.component.html',
  styleUrls: ['./teacher-management.component.css']
})
export class TeacherManagementComponent {

  showModal = false;
  teacherForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService
  ) {
    this.teacherForm = this.fb.group({
      userId: [null, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      qualification: ['', Validators.required],
      experienceYears: [null, Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      classIds: [[]],     // List of Long
      sectionIds: [[]],   // List of Long
      assignedAsClassTeacher: [false],
      classTeacherId: [null]
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.teacherForm.reset();
  }

  onSubmit() {
    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      return;
    }

    // Convert single number to list if needed
    if (typeof this.teacherForm.value.classIds === 'number') {
      this.teacherForm.value.classIds = [this.teacherForm.value.classIds];
    }
    if (typeof this.teacherForm.value.sectionIds === 'number') {
      this.teacherForm.value.sectionIds = [this.teacherForm.value.sectionIds];
    }

    this.teacherService.addTeacher(this.teacherForm.value).subscribe({
      next: () => {
        alert('Teacher Added Successfully');
        this.closeModal();
      },
      error: (err) => {
        console.error('Backend Error:', err);
        alert('Error adding teacher. Check console for details.');
      }
    });
  }
}
