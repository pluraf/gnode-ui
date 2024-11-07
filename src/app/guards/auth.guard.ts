import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BackendService } from '../services/backend.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookies = inject(CookieService);
  const backendService = inject(BackendService);

  const token = cookies.get('access_token');

  if (token && isTokenValid(token)) {
    return backendService.getApiInfo().pipe(
      map((resp) => {
        if (resp && resp.mode === 'virtual') {
          if (
            state.url === '/settings/g-cloud' ||
            state.url === '/settings/network-settings'
          ) {
            router.navigateByUrl('/settings');
            return false;
          }
        }
        return true;
      }),
      catchError((error) => {
        router.navigateByUrl('/login');
        return of(false);
      }),
    );
  } else {
    if (state.url === '/login') {
      return of(true);
    }
    router.navigateByUrl('/login');
    return of(false);
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
