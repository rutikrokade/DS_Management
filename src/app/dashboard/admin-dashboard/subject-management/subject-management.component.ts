import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Subject {
  subjectId?: number;
  subjectName: string;
  subjectCode: string;
  classId: number | null;
  className?: string;
  teacherId: number | null;
  teacherName?: string;
  description?: string;
  maxMarks?: number;
  isActive: boolean;
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
    classId: null,
    teacherId: null,
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

  if (!this.newSubject.subjectName?.trim() ||
      !this.newSubject.subjectCode?.trim() ||
      this.newSubject.classId === null ||
      this.newSubject.teacherId === null) {
    this.showMsg('Please fill all required fields');
    return;
  }

  const payload = {
    subjectName: this.newSubject.subjectName,
    subjectCode: this.newSubject.subjectCode,
    classId: this.newSubject.classId,
    teacherId: this.newSubject.teacherId,
    description: this.newSubject.description,
    maxMarks: this.newSubject.maxMarks,
    isActive: this.newSubject.isActive
  };

  if (this.isEditMode && this.newSubject.subjectId) {

    this.http.put(
      `${this.SUBJECT_API}/${this.newSubject.subjectId}`,
      payload
    ).subscribe({
      next: () => {
        this.showMsg('Subject updated successfully');
        this.afterSave();
      },
      error: err => {
        console.error(err);
        this.showMsg('Update failed');
      }
    });

  } else {

    this.http.post(this.SUBJECT_API, payload).subscribe({
      next: () => {
        this.showMsg('Subject added successfully');
        this.afterSave();
      },
      error: err => {
        console.error(err);
        this.showMsg('Add failed');
      }
    });
  }
}

 afterSave() {
  this.closeModal();
  this.loadSubjects();
}



  /* ================= EDIT SUBJECT ================= */
 editSubject(subject: Subject) {
  this.isEditMode = true;

  this.newSubject = {
    subjectId: subject.subjectId,
    subjectName: subject.subjectName,
    subjectCode: subject.subjectCode,
    classId: Number(subject.classId),
    teacherId: Number(subject.teacherId),
    description: subject.description,
    maxMarks: subject.maxMarks,
    isActive: subject.isActive ?? true
  };

  this.showModal = true;
}

  /* ================= DELETE SUBJECT ================= */
 deleteSubject(id?: number) {
  if (!id) return;

  const confirmDelete = confirm('Are you sure you want to delete this subject?');
  if (!confirmDelete) return;

  this.http.delete(`${this.SUBJECT_API}/${id}`).subscribe({
    next: () => {
      this.showMsg('Subject deleted successfully');
      this.subjects = this.subjects.filter(s => s.subjectId !== id);
    },
    error: err => {
      console.error(err);
      this.showMsg('Delete failed');
    }
  });
}


  /* ================= RESET FORM ================= */
  resetForm() {
    this.isEditMode = false;
    this.newSubject = {
      subjectName: '',
      subjectCode: '',
      classId: null,
      teacherId: null,
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
