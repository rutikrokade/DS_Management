import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ChatboatComponent } from "../../pages/chatboat/chatboat.component";
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-parent-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ChatboatComponent],
  templateUrl: './parent-dashboard.component.html',
  styleUrl: './parent-dashboard.component.css'
})
export class ParentDashboardComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
