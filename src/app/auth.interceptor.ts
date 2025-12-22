import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // ✅ DO NOT ATTACH TOKEN FOR LOGIN API
  if (req.url.includes('/api/auth/login')) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
