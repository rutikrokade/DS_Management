import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerService } from '../register.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status.component.html'
})
export class StatusComponent implements OnInit {

  users: any[] = [];

  constructor(private registerService: registerService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.registerService.getAllUsers().subscribe(
      (res: any) => {
        // ensure res is array and each user has .approved boolean and .status string
        this.users = Array.isArray(res) ? res : [];
      },
      (err: any) => {
        console.error('loadUsers error', err);
        alert('Could not load users. Check console / server logs.');
      }
    );
  }

  approve(user: any) {
    const userId = user.userId ?? user.id;
    // send ACTIVE and approved true
    this.registerService.updateStatus(userId, 'ACTIVE', true).subscribe(
      (updated: any) => {
        // optimistic UI update: reflect change locally
        this.applyLocalStatusUpdate(userId, 'ACTIVE', true);
        alert('User Approved!');
        // optionally reload from server to confirm
        this.loadUsers();
      },
      (err) => {
        console.error('approve error', err);
        alert('Approve failed. Check console / server logs.');
      }
    );
  }

  reject(user: any) {
    const userId = user.userId ?? user.id;
    // send INACTIVE and approved false
    this.registerService.updateStatus(userId, 'INACTIVE', false).subscribe(
      (updated: any) => {
        this.applyLocalStatusUpdate(userId, 'INACTIVE', false);
        alert('User Rejected!');
        this.loadUsers();
      },
      (err) => {
        console.error('reject error', err);
        alert('Reject failed. Check console / server logs.');
      }
    );
  }

  private applyLocalStatusUpdate(userId: number, status: string, approved: boolean) {
    const idx = this.users.findIndex(u => (u.userId ?? u.id) === userId);
    if (idx !== -1) {
      this.users[idx].status = status;
      this.users[idx].approved = approved;
    }
  }
}
