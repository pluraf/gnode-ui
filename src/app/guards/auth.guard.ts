import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookies = inject(CookieService);

  const token = cookies.get('access_token');
  if (token) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
