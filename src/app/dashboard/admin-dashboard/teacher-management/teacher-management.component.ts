import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 
declare var bootstrap: any;
 
@Component({
  selector: 'app-teacher-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-management.component.html'
})
export class TeacherManagementComponent implements OnInit {
 
  teacherForm!: FormGroup;
  teachers: any[] = [];
 
  editMode = false;
  editingTeacherId: number | null = null;
 
  loading = false;
  successMessage = '';
  errorMessage = '';
 
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
 
 
  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}
 
  ngOnInit(): void {
    this.initForm();
    this.loadTeachers();
    this.handleClassTeacherToggle();
  }
 
  // ---------------- FORM INIT ----------------
  initForm() {
    this.teacherForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      qualification: ['', Validators.required],
      experienceYears: [0, [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
 
      assignedAsClassTeacher: [false],
      classId: [null],
      sectionId: [null]
    });
  }
 
  // ---------------- CHECKBOX HANDLER ----------------
  handleClassTeacherToggle() {
    this.teacherForm.get('assignedAsClassTeacher')?.valueChanges
      .subscribe((checked: boolean) => {
 
        if (checked) {
          this.teacherForm.get('classId')?.setValidators(Validators.required);
          this.teacherForm.get('sectionId')?.setValidators(Validators.required);
        } else {
 
          // ❗ ONLY clear in CREATE mode
          if (!this.editMode) {
            this.teacherForm.patchValue({
              classId: null,
              sectionId: null
            });
          }
 
          this.teacherForm.get('classId')?.clearValidators();
          this.teacherForm.get('sectionId')?.clearValidators();
        }
 
        this.teacherForm.get('classId')?.updateValueAndValidity();
        this.teacherForm.get('sectionId')?.updateValueAndValidity();
      });
  }
 
  // ---------------- LOAD ----------------
  loadTeachers() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
 
    this.http.get<any[]>('http://localhost:8090/api/teacher/fetch-all', { headers })
      .subscribe({
        next: res => this.teachers = res,
        error: err => console.error(err)
      });
  }
 
  // ---------------- CREATE MODAL ----------------
  openCreateModal() {
    this.editMode = false;
    this.editingTeacherId = null;
 
    this.teacherForm.reset({ assignedAsClassTeacher: false });
    this.teacherForm.get('classId')?.enable();
    this.teacherForm.get('sectionId')?.enable();
 
    const modal = new bootstrap.Modal(
      document.getElementById('teacherModal')!,
      { backdrop: 'static', keyboard: false }
    );
    modal.show();
  }
 
  // ---------------- EDIT ----------------
  editTeacher(teacher: any) {
    this.editMode = true;
    this.editingTeacherId = teacher.id;
 
    this.teacherForm.reset();
 
    // 🔥 VERY IMPORTANT
    this.teacherForm.patchValue({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      qualification: teacher.qualification,
      experienceYears: teacher.experienceYears,
      gender: teacher.gender,
      dateOfBirth: teacher.dateOfBirth,
      assignedAsClassTeacher: true,
      classId: teacher.classId,
      sectionId: teacher.sectionId
    }, { emitEvent: false });
 
    // 🔒 IDs should not be editable in edit
    this.teacherForm.get('classId')?.disable({ emitEvent: false });
    this.teacherForm.get('sectionId')?.disable({ emitEvent: false });
 
    const modal = new bootstrap.Modal(
      document.getElementById('teacherModal')!,
      { backdrop: 'static', keyboard: false }
    );
    modal.show();
  }
 
  // ---------------- SUBMIT ----------------
  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
 
    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      return;
    }
 
    this.loading = true;
 
    const payload = this.teacherForm.getRawValue();
 
    if (!payload.assignedAsClassTeacher) {
      delete payload.classId;
      delete payload.sectionId;
    }
 
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
 
    if (this.editMode && this.editingTeacherId) {
 
      // -------- UPDATE --------
      this.http.put(
        `http://localhost:8090/api/teacher/${this.editingTeacherId}`,
        payload,
        { headers }
      ).subscribe({
        next: () => this.afterSuccess('Teacher updated successfully'),
        error: err => this.handleError(err)
      });
 
    } else {
 
      // -------- CREATE --------
      this.http.post(
        'http://localhost:8090/api/teacher',
        payload,
        { headers }
      ).subscribe({
        next: () => this.afterSuccess('Teacher created successfully'),
        error: err => this.handleError(err)
      });
    }
  }
 
  // ---------------- DELETE ----------------
  deleteTeacher(id: number) {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
 
    const knownModal = bootstrap.Modal.getInstance(
      document.getElementById('teacherModal')!
    );
    knownModal?.hide(); // 🔥 prevents black screen
 
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
 
    this.http.delete(`http://localhost:8090/api/teacher/${id}`, { headers })
      .subscribe({
        next: () => this.loadTeachers(),
        error: err => console.error(err)
      });
  }
 
  // ---------------- COMMON ----------------
  afterSuccess(msg: string) {
    this.loading = false;
    this.showToast(msg, 'success');
 
    this.teacherForm.reset({ assignedAsClassTeacher: false });
    this.teacherForm.get('classId')?.enable();
    this.teacherForm.get('sectionId')?.enable();
 
    this.editMode = false;
    this.editingTeacherId = null;
 
    this.loadTeachers();
 
    bootstrap.Modal.getInstance(
      document.getElementById('teacherModal')!
    )?.hide();
  }
 
 handleError(err: any) {
  this.loading = false;
  console.error(err);
 
  this.showToast(
    err.error?.error || 'Something went wrong',
    'error'
  );
}
 
showToast(message: string, type: 'success' | 'error' = 'success') {
  this.toastMessage = message;
 
  const toastEl = document.getElementById('appToast')!;
 
  toastEl.classList.remove('bg-success', 'bg-danger');
  toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');
 
  const toast = new bootstrap.Toast(toastEl, {
    delay: 3000
  });
 
  toast.show();
}
}