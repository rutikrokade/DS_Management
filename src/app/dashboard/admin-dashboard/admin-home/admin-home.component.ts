import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
   constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }
  goToStatus() {
  this.router.navigate(['/status']);
}


}
