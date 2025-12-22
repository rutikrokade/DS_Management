import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Subject {
  subjectId?: number;
  subjectName: string;
  subjectCode: string;
  classId?: number;
  className?: string;
  teacherId?: number;
  teacherName?: string;
  description?: string;
  maxMarks?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-subject-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.css']
})
export class SubjectManagementComponent implements OnInit {

  subjects: Subject[] = [];
  isEditMode = false;
  showToast = false;
  toastMessage = '';
  showModal = false;

  newSubject: Subject = {
    subjectName: '',
    subjectCode: '',
    classId: undefined,
    teacherId: undefined,
    description: '',
    maxMarks: 0,
    isActive: true
  };

  private SUBJECT_API = 'http://localhost:8090/api/admin/subjects';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  /* ================= LOAD SUBJECTS ================= */
  loadSubjects() {
    this.http.get<Subject[]>(this.SUBJECT_API).subscribe({
      next: res => this.subjects = Array.isArray(res) ? res : [],
      error: err => console.error('Load subjects error:', err)
    });
  }

  /* ================= MODAL CONTROLS ================= */
  openModal() {
  this.showModal = true;
}

closeModal() {
  this.showModal = false;
  this.resetForm();
}

  /* ================= SAVE / UPDATE SUBJECT ================= */
  saveSubject() {
    if (!this.newSubject.subjectName || !this.newSubject.subjectCode || !this.newSubject.classId || !this.newSubject.teacherId) {
      this.showMsg('Please fill all required fields');
      return;
    }

    if (this.isEditMode && this.newSubject.subjectId) {
      this.http.put<Subject>(`${this.SUBJECT_API}/${this.newSubject.subjectId}`, this.newSubject)
        .subscribe({
          next: res => {
            this.showMsg('Subject updated successfully');
            this.closeModal();
            this.loadSubjects();
          },
          error: err => {
            console.error('Update error:', err);
            this.showMsg('Error updating subject');
          }
        });
    } else {
      this.http.post<Subject>(this.SUBJECT_API, this.newSubject)
        .subscribe({
          next: res => {
            this.showMsg('Subject added successfully');
            this.closeModal();
            this.loadSubjects();
          },
          error: err => {
            console.error('Add error:', err);
            this.showMsg('Error adding subject');
          }
        });
    }
  }

  /* ================= EDIT SUBJECT ================= */
  editSubject(subject: Subject) {
    this.newSubject = { ...subject };
    this.isEditMode = true;
    this.openModal();
  }

  /* ================= DELETE SUBJECT ================= */
  deleteSubject(id?: number) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this subject?')) return;

    this.http.delete(`${this.SUBJECT_API}/${id}`).subscribe({
      next: () => {
        this.showMsg('Subject deleted successfully');
        this.loadSubjects();
      },
      error: err => {
        console.error('Delete error:', err);
        this.showMsg('Error deleting subject');
      }
    });
  }

  /* ================= RESET FORM ================= */
  resetForm() {
    this.isEditMode = false;
    this.newSubject = {
      subjectName: '',
      subjectCode: '',
      classId: undefined,
      teacherId: undefined,
      description: '',
      maxMarks: 0,
      isActive: true
    };
  }

  /* ================= TOAST ================= */
  showMsg(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }
}
