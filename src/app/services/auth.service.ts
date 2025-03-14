import { inject, Injectable } from '@angular/core';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { ApiService } from './api.service';
import { InfoService } from './info.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiService = inject(ApiService);
  infoService = inject(InfoService);
  cookies = inject(CookieService);
  router = inject(Router);

  private tokenExpirationTimer: any = null;
  token: string = '';
  private cookieOptions: CookieOptions = {
    secure: window.location.protocol === 'https:',
    sameSite: 'Lax',
    path: '/',
  };

  constructor() {
    this.token = this.cookies.get('access_token');
  }

  storeToken(token: string): void {
    this.cookies.set('access_token', token, this.cookieOptions);
    this.token = token;
  }

  logout(): void {
    this.infoService.dropCache();
    this.cookies.delete('access_token', '/');
    this.token = '';
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    if (this.infoService.infoData().anonymous) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getToken(): string {
    return this.token;
  }

  isLoggedIn(): boolean {
    return this.isTokenValid();
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

  isTokenValid(): boolean {
    if (!this.token) return false;
    try {
        const payload = JSON.parse(atob(this.token.split('.')[1]));
        return true;
    } catch (error) {
      console.error('Invalid token', error);
      return false;
    }
  }
}
