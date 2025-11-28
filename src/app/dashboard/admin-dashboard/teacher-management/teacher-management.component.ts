import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-teacher-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './teacher-management.component.html',
  styleUrls: ['./teacher-management.component.css']
})
export class TeacherManagementComponent {

  showModal = false;
  isEdit = false;

  teacherForm!: FormGroup;
  selectedTeacher: any = null;

  // Classes (object format)
  classList = [
    { id: 1, name: 'Class 1' },
    { id: 2, name: 'Class 2' },
    { id: 3, name: 'Class 3' },
    { id: 4, name: 'Class 4' }
  ];

  // Sections (object format)
  sectionList = [
    { id: 'A', name: 'Section A' },
    { id: 'B', name: 'Section B' },
    { id: 'C', name: 'Section C' }
  ];

  teacherList: any[] = [
    {
      id: 1,
      userId: 101,
      firstName: "kunal",
      lastName: "Sharma",
      email: "kunal@gmail.com",
      phone: "9876543210",
      qualification: "MSc Maths",
      experienceYears: 5,
      gender: "Male",
      dateOfBirth: "1990-05-10",
      classIds: [1, 3],
      sectionIds: ['A', 'B'],
      assignedAsClassTeacher: true,
      classTeacherId: 501
    }
  ];

  constructor(private fb: FormBuilder) {
    this.teacherForm = this.fb.group({
      userId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      qualification: ['', Validators.required],
      experienceYears: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      classIds: [[]],
      sectionIds: [[]],
      assignedAsClassTeacher: [false],
      classTeacherId: ['']
    });
  }

  openModal() {
    this.showModal = true;
    this.isEdit = false;
    this.teacherForm.reset();
  }

  closeModal() {
    this.showModal = false;
  }

  editTeacher(t: any) {
    this.showModal = true;
    this.isEdit = true;
    this.selectedTeacher = t;

    this.teacherForm.patchValue(t);
  }

  deleteTeacher(t: any) {
    this.teacherList = this.teacherList.filter(x => x.id !== t.id);
  }

  onSubmit() {
    if (this.teacherForm.invalid) return;

    if (this.isEdit) {
      Object.assign(this.selectedTeacher, this.teacherForm.value);
    } else {
      this.teacherList.push({
        id: Date.now(),
        ...this.teacherForm.value
      });
    }

    this.closeModal();
  }

}
