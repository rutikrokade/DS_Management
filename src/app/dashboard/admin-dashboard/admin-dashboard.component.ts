import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ChatboatComponent } from "../../pages/chatboat/chatboat.component";
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ChatboatComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
