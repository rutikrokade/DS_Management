import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // ❌ Not logged in
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 🎭 Role check (optional)
  const allowedRoles: string[] | undefined = route.data?.['roles'];
  const userRole = authService.getRole();

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    router.navigate(['/login']); // or unauthorized page
    return false;
  }

  return true;
};
