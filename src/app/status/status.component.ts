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
        this.users = res;
      },
      (err: any) => console.error(err)
    );
  }

  approve(userId: number) {
    // backend expects: ACTIVE
    this.registerService.updateStatus(userId, 'ACTIVE').subscribe(
      () => {
        alert('User Approved!');
        this.loadUsers();
      },
      (err) => console.error(err)
    );
  }

  reject(userId: number) {
    // backend expects: INACTIVE
    this.registerService.updateStatus(userId, 'INACTIVE').subscribe(
      () => {
        alert('User Rejected!');
        this.loadUsers();
      },
      (err) => console.error(err)
    );
  }

}
