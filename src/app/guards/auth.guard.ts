import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookies = inject(CookieService);

  const token = cookies.get('access_token');

  if (token) {
    if (state.url === '/login') {
      router.navigateByUrl('/channels');
      return false;
    }
    return true;
  } else {
    if (state.url === '/login') {
      return true;
    }
    router.navigateByUrl('/login');
    return false;
  }
};
