import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Subject {
  subjectId?: number;
  subjectName: string;
  subjectCode: string;
  classId?: number;
  teacherId?: number;
  description?: string;
  maxMarks?: number;
  isActive?: boolean;
}

interface SchoolClass {
  classId: number;
  className: string;
}

interface Teacher {
  teacherId: number;
  teacherName: string;
}

@Component({
  selector: 'app-subject-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subject-management.component.html'
})
export class SubjectManagementComponent implements OnInit {

  subjects: Subject[] = [];
  classes: SchoolClass[] = [];
  teachers: Teacher[] = [];

  isEditMode = false;
  showToast = false;
  toastMessage = '';

  newSubject: Subject = {
    subjectName: '',
    subjectCode: '',
    isActive: true
  };

  private SUBJECT_API = 'http://localhost:8090/api/admin/subjects';
  private CLASS_API = 'http://localhost:8090/api/class/fetch-all';
  private TEACHER_API = 'http://localhost:8090/api/teacher/fetch-all';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSubjects();
    this.loadClasses();
    this.loadTeachers();
  }

  /* ================= LOAD DATA ================= */

  loadSubjects() {
    this.http.get<any>(this.SUBJECT_API).subscribe({
      next: res => {
        const list = Array.isArray(res) ? res : res.data ?? [];

        // 🔥 map nested class & teacher
        this.subjects = list.map((s: any) => ({
          subjectId: s.subjectId,
          subjectName: s.subjectName,
          subjectCode: s.subjectCode,
          classId: s.class?.classId,
          teacherId: s.teacher?.teacherId,
          maxMarks: s.maxMarks,
          isActive: s.isActive
        }));
      },
      error: err => console.error(err)
    });
  }

  loadClasses() {
    this.http.get<any>(this.CLASS_API).subscribe(res => {
      this.classes = Array.isArray(res) ? res : res.data ?? [];
    });
  }

  loadTeachers() {
    this.http.get<any>(this.TEACHER_API).subscribe(res => {
      const list = Array.isArray(res) ? res : res.data ?? [];
      this.teachers = list.map((t: any) => ({
        teacherId: t.teacherId ?? t.id,
        teacherName: t.teacherName ?? t.name
      }));
    });
  }

  /* ================= CRUD ================= */

  saveSubject() {
    const payload = {
      ...this.newSubject,
      class: { classId: this.newSubject.classId },
      teacher: { teacherId: this.newSubject.teacherId }
    };

    const req = this.isEditMode
      ? this.http.put(`${this.SUBJECT_API}/${this.newSubject.subjectId}`, payload)
      : this.http.post(this.SUBJECT_API, payload);

    req.subscribe(() => {
      this.showMsg(this.isEditMode ? 'Subject updated' : 'Subject added');
      this.resetForm();
      this.loadSubjects();
    });
  }

  editSubject(subject: Subject) {
    this.newSubject = { ...subject };
    this.isEditMode = true;
  }

  cancelEdit() {
    this.resetForm();
  }

  deleteSubject(id?: number) {
    if (!id) return;
    this.http.delete(`${this.SUBJECT_API}/${id}`).subscribe(() => {
      this.showMsg('Subject deleted');
      this.loadSubjects();
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.newSubject = {
      subjectName: '',
      subjectCode: '',
      isActive: true
    };
  }

  showMsg(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2500);
  }

  /* ================= DISPLAY HELPERS ================= */

  getClassName(id?: number) {
    return this.classes.find(c => c.classId === id)?.className || '-';
  }

  getTeacherName(id?: number) {
    return this.teachers.find(t => t.teacherId === id)?.teacherName || '-';
  }
}
