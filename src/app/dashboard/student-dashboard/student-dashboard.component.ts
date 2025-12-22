import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { ChatboatComponent } from "../../pages/chatboat/chatboat.component";
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ChatboatComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
