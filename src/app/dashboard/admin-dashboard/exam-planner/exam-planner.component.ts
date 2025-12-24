import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamService } from '../../../exam.service';

@Component({
  selector: 'app-exam-planner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam-planner.component.html',
  styleUrls: ['./exam-planner.component.css']
})
export class ExamPlannerComponent implements OnInit {

  // ===============================
  // STATE
  // ===============================
  exams: any[] = [];
  classes: any[] = [];
  sections: any[] = [];
  subjects: any[] = [];

  showForm = false;
  isEdit = false;
  examId = 0;

  // ===============================
  // FORM
  // ===============================
  examForm = this.fb.group({
    examName: ['', Validators.required],
    classId: ['', Validators.required],
    sectionId: ['', Validators.required],
    subjectId: ['', Validators.required],
    teacherId: ['', Validators.required],
    term: ['', Validators.required],
    examType: ['ONLINE', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    duration: [{ value: '', disabled: true }], // AUTO
    totalMarks: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private examService: ExamService
  ) {}

  // ===============================
  // INIT
  // ===============================
  ngOnInit(): void {
    this.loadExams();
    this.loadClasses();

    // AUTO DURATION CALC
    this.examForm.get('startTime')?.valueChanges.subscribe(() => {
      this.calculateDuration();
    });

    this.examForm.get('endTime')?.valueChanges.subscribe(() => {
      this.calculateDuration();
    });
  }

  // ===============================
  // LOAD EXAMS
  // ===============================
  loadExams() {
    this.examService.getExams().subscribe({
      next: res => this.exams = res,
      error: err => console.error('Load exams error', err)
    });
  }

  // ===============================
  // LOAD CLASSES
  // ===============================
  loadClasses() {
    this.examService.getClasses().subscribe({
      next: res => this.classes = res,
      error: err => console.error('Load classes error', err)
    });
  }

  // ===============================
  // CLASS CHANGE → LOAD SECTIONS
  // ===============================
  onClassChange(event: Event) {
    const classId = Number((event.target as HTMLSelectElement).value);

    this.sections = [];
    this.subjects = [];

    this.examForm.patchValue({
      sectionId: '',
      subjectId: ''
    });

    if (!classId) return;

    this.examService.getSectionsByClass(classId).subscribe({
      next: res => this.sections = res,
      error: err => console.error('Load sections error', err)
    });
  }

  // ===============================
  // SECTION CHANGE → LOAD SUBJECTS
  // ===============================
  onSectionChange() {
    // ⚠️ Backend me section-wise subject API nahi hai
    // Isliye all subjects load kar rahe hain
    this.examService.getSubjects().subscribe({
      next: res => this.subjects = res,
      error: err => console.error('Load subjects error', err)
    });
  }

  // ===============================
  // OPEN CREATE FORM
  // ===============================
  openCreateForm() {
    this.showForm = true;
    this.isEdit = false;
    this.examId = 0;

    this.sections = [];
    this.subjects = [];

    this.examForm.reset({
      examType: 'ONLINE'
    });
  }

  // ===============================
  // EDIT EXAM
  // ===============================
  editExam(exam: any) {
    this.showForm = true;
    this.isEdit = true;
    this.examId = exam.examId;

    this.examForm.patchValue({
      examName: exam.examName,
      classId: exam.classId,
      sectionId: exam.sectionId,
      subjectId: exam.subjectId,
      teacherId: exam.teacherId,
      term: 'Mid Term', // backend se nahi aa raha
      examType: exam.examType,
      startTime: this.formatForInput(exam.startTime),
      endTime: this.formatForInput(exam.endTime),
      totalMarks: exam.totalMarks
    });

    // Load sections & subjects for edit mode
    this.examService.getSectionsByClass(exam.classId).subscribe(res => {
      this.sections = res;
    });

    this.examService.getSubjects().subscribe(res => {
      this.subjects = res;
    });

    setTimeout(() => this.calculateDuration());
  }

  // ===============================
  // CALCULATE DURATION
  // ===============================
  private calculateDuration() {
    const start = this.examForm.get('startTime')?.value;
    const end = this.examForm.get('endTime')?.value;

    if (!start || !end) {
      this.examForm.get('duration')?.setValue('');
      return;
    }

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (endTime > startTime) {
      const diffMinutes = Math.floor(
        (endTime - startTime) / (1000 * 60)
      );

      this.examForm.get('duration')?.setValue(diffMinutes.toString());
      this.examForm.get('endTime')?.setErrors(null);
    } else {
      this.examForm.get('duration')?.setValue('');
      this.examForm.get('endTime')?.setErrors({ invalidTime: true });
    }
  }

  // ===============================
  // SUBMIT (CREATE / UPDATE)
  // ===============================
  submitExam() {
    if (this.examForm.invalid) return;

    const payload = {
      ...this.examForm.getRawValue(),
      startTime: this.toBackendDateTime(this.examForm.value.startTime!),
      endTime: this.toBackendDateTime(this.examForm.value.endTime!)
    };

    if (this.isEdit) {
      this.examService.updateExam(this.examId, payload).subscribe({
        next: () => {
          alert('Exam updated successfully');
          this.afterSuccess();
        },
        error: err => console.error('Update error', err)
      });
    } else {
      this.examService.createExam(payload).subscribe({
        next: () => {
          alert('Exam created successfully');
          this.afterSuccess();
        },
        error: err => console.error('Create error', err)
      });
    }
  }

  // ===============================
  // DELETE
  // ===============================
  deleteExam(id: number) {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    this.examService.deleteExam(id).subscribe({
      next: () => this.loadExams(),
      error: err => console.error('Delete error', err)
    });
  }

  // ===============================
  // CLOSE FORM
  // ===============================
  closeForm() {
    this.showForm = false;
    this.isEdit = false;
    this.examId = 0;
  }

  afterSuccess() {
    this.closeForm();
    this.loadExams();
  }

  // ===============================
  // DATE HELPERS
  // ===============================
  private formatForInput(dateTime: string): string {
    return dateTime ? dateTime.substring(0, 16) : '';
  }

  private toBackendDateTime(value: string): string {
    return value && value.length === 16 ? value + ':00' : value;
  }
}
