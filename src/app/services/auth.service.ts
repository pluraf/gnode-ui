import { inject, Injectable } from '@angular/core';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { ApiService } from './api.service';
import { SettingsService } from './settings.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiService = inject(ApiService);
  cookies = inject(CookieService);
  settingsService = inject(SettingsService);
  router = inject(Router);

  token: string = '';
  private cookieOptions: CookieOptions = {
    secure: window.location.protocol === 'https:',
    sameSite: 'Lax',
  };

  isVirtualMode: string = '';

  constructor() {
    this.token = this.cookies.get('access_token');
  }
  storeToken(token: string): void {
    this.cookies.set('access_token', token, this.cookieOptions);
    this.token = token;
  }

  logout(): void {
    this.clearAuthCookies();
    this.token = '';
  }

  private clearAuthCookies(): void {
    this.cookies.delete('access_token', '/');
    this.cookies.delete('settingsData', '/');
  }

  getToken(): string {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token && this.isTokenValid();
  }

  isTokenValid() {
    try {
      if (this.token) {
        const payload = JSON.parse(atob(this.token.split('.')[1]));
        if (payload.exp) {
          const expiry = payload.exp * 1000;
          return Date.now() < expiry;
        }
      }
    } catch (error) {
      console.error('Invalid token', error);
    }
    return false;
  }
}
