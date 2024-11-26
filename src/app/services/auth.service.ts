import { inject, Injectable } from '@angular/core';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiService = inject(ApiService);
  cookies = inject(CookieService);
  router = inject(Router);

  private tokenExpirationTimer: any;
  token: string = '';
  private cookieOptions: CookieOptions = {
    secure: window.location.protocol === 'https:',
    sameSite: 'Lax',
    path: '/',
  };

  isVirtualMode: string = '';

  constructor() {
    this.token = this.cookies.get('access_token');
  }
  storeToken(token: string): void {
    this.cookies.set('access_token', token, this.cookieOptions);
    this.token = token;
    this.router.navigate(['/channels']);
  }

  logout(): void {
    this.cookies.delete('access_token', '/');
    this.token = '';
    this.router.navigate(['/login']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  getToken(): string {
    return this.token;
  }

  isLoggedIn(): boolean {
    const { isValid } = this.isTokenValid();
    return isValid;
  }

  getLoggedinUser() {
    const token = this.getToken();
    if (token) {
      const payload = token.split('.')[1];
      const decodedPayload = window.atob(payload);
      const parsePayload = JSON.parse(decodedPayload);
      return parsePayload;
    } else {
      return null;
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  isTokenValid(): { isValid: boolean; expiry: number } {
    if (!this.token) return { isValid: false, expiry: 0 };
    try {
      if (this.token) {
        const payload = JSON.parse(atob(this.token.split('.')[1]));
        if (payload.exp) {
          const expiry = payload.exp * 1000;
          return { isValid: Date.now() < expiry, expiry };
        }
      }
    } catch (error) {
      console.error('Invalid token', error);
    }
    return { isValid: false, expiry: 0 };
  }
}
