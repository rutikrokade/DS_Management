import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClassSectionService } from '../../../class-section.service';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-class-section',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './class-section.component.html'
})
export class ClassSectionComponent implements OnInit {
 
  classForm!: FormGroup;
  sectionForm!: FormGroup;
  updateSectionForm!: FormGroup;
 
  allClasses: any[] = [];
  allSections: any[] = [];
 
  selectedClassId!: number;
 
  constructor(private fb: FormBuilder, private api: ClassSectionService) {}
 
  ngOnInit(): void {
    this.createForms();
    this.loadClasses();
  }
 
  createForms() {
    this.classForm = this.fb.group({
      className: ['', Validators.required],
      description: ['']
    });
 
    this.sectionForm = this.fb.group({
      classId: ['', Validators.required],
      sectionName: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]]
    });
 
    this.updateSectionForm = this.fb.group({
      sectionId: ['', Validators.required],
      sectionName: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]]
    });
  }
 
  /* ================= CLASSES ================= */
 
  loadClasses() {
    this.api.getAllClasses().subscribe({
      next: res => this.allClasses = res,
      error: err => console.error(err)
    });
  }
 
  createClass() {
    this.api.createClass(this.classForm.value).subscribe(() => {
      alert('Class Created');
      this.classForm.reset();
      this.loadClasses();
    });
  }
 
  /* ================= SECTIONS ================= */
 
  onClassChange(classId: number) {
    this.selectedClassId = classId;
    this.loadSections(classId);
  }
 
  loadSections(classId: number) {
    this.api.getSectionsByClass(classId).subscribe({
      next: res => this.allSections = res,
      error: err => console.error(err)
    });
  }
 
  createSection() {
    const classId = this.sectionForm.value.classId;
    const payload = {
      sectionName: this.sectionForm.value.sectionName,
      capacity: this.sectionForm.value.capacity
    };
 
    this.api.createSection(classId, payload).subscribe(() => {
      alert('Section Created');
      this.sectionForm.reset();
      this.loadSections(classId);
    });
  }
 
  setUpdate(section: any) {
    this.updateSectionForm.patchValue({
      sectionId: section.sectionId,
      sectionName: section.sectionName,
      capacity: section.capacity
    });
  }
 
  updateSection() {
    const sectionId = this.updateSectionForm.value.sectionId;
    this.api.updateSection(sectionId, this.updateSectionForm.value).subscribe(() => {
      alert('Section Updated');
      this.loadSections(this.selectedClassId);
    });
  }
 
  deleteSection(sectionId: number) {
    if (!confirm('Delete this section?')) return;
    this.api.deleteSection(sectionId).subscribe(() => {
      alert('Section Deleted');
      this.loadSections(this.selectedClassId);
    });
  }
}
 