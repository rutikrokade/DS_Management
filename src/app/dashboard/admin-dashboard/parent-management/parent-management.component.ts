import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParentService } from '../../../parent.service';

@Component({
  selector: 'app-parent-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './parent-management.component.html',
  styleUrl: './parent-management.component.css'
})
export class ParentManagementComponent implements OnInit {

  parentForm!: FormGroup;
  parents: any[] = [];

  showForm = false;
  successMsg = '';
  errorMsg = '';

  relationships = ['FATHER', 'MOTHER', 'GUARDIAN'];

  constructor(
    private fb: FormBuilder,
    private parentService: ParentService
  ) {
    this.parentForm = this.fb.group({
      userId: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      relationship: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadParents();
  }

  // 🔹 Load parent list
  loadParents() {
    this.parentService.getAllParents().subscribe({
      next: res => this.parents = res,
      error: () => this.errorMsg = 'Failed to load parents'
    });
  }

  // 🔹 Open add form
  openForm() {
    this.showForm = true;
    this.parentForm.reset();
    this.successMsg = '';
    this.errorMsg = '';
  }

  // 🔹 Close add form
  closeForm() {
    this.showForm = false;
  }

  // 🔹 Submit form
  submit() {
    if (this.parentForm.invalid) {
      this.parentForm.markAllAsTouched();
      return;
    }

    this.parentService.createParent(this.parentForm.value).subscribe({
      next: () => {
        this.successMsg = 'Parent added successfully ✅';
        this.errorMsg = '';
        this.showForm = false;
        this.loadParents();
      },
      error: err => {
        this.errorMsg = err?.error?.error || 'Failed to add parent';
        this.successMsg = '';
      }
    });
  }

  // 🔹 DELETE parent (FIXED)
  deleteParent(id: number) {
    if (!confirm('Are you sure you want to delete this parent?')) {
      return;
    }

    this.parentService.deleteParent(id).subscribe({
      next: () => {
        // ✅ remove from table instantly
        this.parents = this.parents.filter(p => p.parentId !== id);
        alert('Parent deleted successfully ✅');
      },
      error: err => {
        alert(
          err?.error?.error ||
          err?.error ||
          'Delete failed. Parent may be linked with student.'
        );
      }
    });
  }
}
