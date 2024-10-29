import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookies = inject(CookieService);

  const token = cookies.get('access_token');

  if (token && isTokenValid(token)) {
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

// Function to check token expiration
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return Date.now() < expiry;
  } catch (error) {
    return false;
  }
}
