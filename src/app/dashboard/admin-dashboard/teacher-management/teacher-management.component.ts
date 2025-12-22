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
  classes: any[] = [];
  sections: any[] = [];

  editMode = false;
  editingTeacherId: number | null = null;

  toastMessage = '';
errorMessage: any;
successMessage: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.initForm();
    this.loadTeachers();
    this.loadClasses();
    this.handleClassTeacherToggle();
  }

  // ================= FORM =================
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

  // ================= CHECKBOX =================
  handleClassTeacherToggle() {
    this.teacherForm.get('assignedAsClassTeacher')?.valueChanges
      .subscribe((checked: boolean) => {

        if (checked) {
          this.teacherForm.get('classId')?.setValidators(Validators.required);
          this.teacherForm.get('sectionId')?.setValidators(Validators.required);
        } else {
          if (!this.editMode) {
            this.teacherForm.patchValue({ classId: null, sectionId: null });
          }
          this.sections = [];
          this.teacherForm.get('classId')?.clearValidators();
          this.teacherForm.get('sectionId')?.clearValidators();
        }

        this.teacherForm.get('classId')?.updateValueAndValidity();
        this.teacherForm.get('sectionId')?.updateValueAndValidity();
      });
  }

  // ================= LOAD =================
  loadTeachers() {
    this.http.get<any[]>(
      'http://localhost:8090/api/teacher/fetch-all',
      { headers: this.authHeaders() }
    ).subscribe(res => this.teachers = res);
  }

  loadClasses() {
    this.http.get<any[]>(
      'http://localhost:8090/api/class/fetch-all',
      { headers: this.authHeaders() }
    ).subscribe(res => this.classes = res);
  }

  // ================= CLASS CHANGE =================
  onClassChange(event: Event) {
    const classId = Number((event.target as HTMLSelectElement).value);

    if (!classId) {
      this.sections = [];
      this.teacherForm.patchValue({ sectionId: null });
      return;
    }

    this.teacherForm.patchValue({ sectionId: null });

    this.http.get<any[]>(
      `http://localhost:8090/api/section/classes/${classId}/sections/fetch-all`,
      { headers: this.authHeaders() }
    ).subscribe(res => this.sections = res);
  }

  // ================= CREATE =================
  openCreateModal() {
    this.editMode = false;
    this.editingTeacherId = null;
    this.teacherForm.reset({ assignedAsClassTeacher: false });
    this.sections = [];

    new bootstrap.Modal(
      document.getElementById('teacherModal')!,
      { backdrop: 'static', keyboard: false }
    ).show();
  }

  // ================= EDIT =================
  editTeacher(teacher: any) {
    this.editMode = true;
    this.editingTeacherId = teacher.id;

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
      classId: teacher.classId
    });

    this.loadSectionsForEdit(teacher.classId, teacher.sectionId);

    new bootstrap.Modal(
      document.getElementById('teacherModal')!,
      { backdrop: 'static', keyboard: false }
    ).show();
  }

  loadSectionsForEdit(classId: number, sectionId: number) {
    this.http.get<any[]>(
      `http://localhost:8090/api/section/classes/${classId}/sections/fetch-all`,
      { headers: this.authHeaders() }
    ).subscribe(res => {
      this.sections = res;
      this.teacherForm.patchValue({ sectionId });
    });
  }

  // ================= SUBMIT =================
  onSubmit() {
    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      return;
    }

    const payload = this.teacherForm.getRawValue();

    if (!payload.assignedAsClassTeacher) {
      delete payload.classId;
      delete payload.sectionId;
    }

    if (this.editMode && this.editingTeacherId) {
      this.http.put(
        `http://localhost:8090/api/teacher/${this.editingTeacherId}`,
        payload,
        { headers: this.authHeaders(true) }
      ).subscribe({
        next: () => this.afterSuccess('Teacher updated successfully'),
        error: () => this.showToast('Update failed')
      });

    } else {
      this.http.post(
        'http://localhost:8090/api/teacher',
        payload,
        { headers: this.authHeaders(true) }
      ).subscribe({
        next: (res: any) => {
          this.editingTeacherId = res.id; // 🔥 new teacher id
          this.afterSuccess('Teacher created successfully');
        },
        error: () => this.showToast('Create failed')
      });
    }
  }

  // ================= ASSIGN TEACHER =================
  assignTeacherToClass() {
    if (!this.teacherForm.value.assignedAsClassTeacher) return;

    const classId = this.teacherForm.value.classId;
    const sectionId = this.teacherForm.value.sectionId;
    const teacherId = this.editingTeacherId;

    if (!classId || !sectionId || !teacherId) return;

    this.http.post(
      `http://localhost:8090/api/teacher/classes/${classId}/sections/${sectionId}/assign`,
      { teacherId },
      { headers: this.authHeaders(true) }
    ).subscribe({
      next: () => this.showToast('Teacher assigned successfully'),
      error: err =>
        this.showToast(
          err.status === 409 ? err.error.error : 'Assignment failed'
        )
    });
  }

  // ================= DELETE =================
  deleteTeacher(id: number) {
    if (!confirm('Delete this teacher?')) return;

    this.http.delete(
      `http://localhost:8090/api/teacher/${id}`,
      { headers: this.authHeaders() }
    ).subscribe(() => this.loadTeachers());
  }

  // ================= COMMON =================
  afterSuccess(msg: string) {
    this.assignTeacherToClass(); // 🔥 FINAL STEP

    this.showToast(msg);
    this.teacherForm.reset({ assignedAsClassTeacher: false });
    this.sections = [];
    this.editMode = false;
    this.editingTeacherId = null;
    this.loadTeachers();

    bootstrap.Modal.getInstance(
      document.getElementById('teacherModal')!
    )?.hide();
  }

  showToast(message: string) {
    this.toastMessage = message;
    new bootstrap.Toast(
      document.getElementById('appToast')!,
      { delay: 3000 }
    ).show();
  }

  authHeaders(json = false) {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      ...(json && { 'Content-Type': 'application/json' })
    });
  }
}
