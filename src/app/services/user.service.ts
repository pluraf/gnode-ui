import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private token: string | null = null;
  private isAdmin: boolean = false;

  constructor() {}

  login(token: string) {
    this.token = token;
    sessionStorage.setItem('access_token', token);

    // Set the admin status based on the parsed token
    const user = this.parseJwt(token);
    this.setAdminStatus(user.is_admin);
  }

  logout() {
    this.token = null;
    this.isAdmin = false;
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('is_admin');
  }

  setAdminStatus(status: boolean) {
    this.isAdmin = status;
    sessionStorage.setItem('is_admin', String(status));
  }
  getAdminStatus(): boolean {
    return this.isAdmin || sessionStorage.getItem('is_admin') === 'true';
  }

  getToken(): string | null {
    return this.token || sessionStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('access_token');
  }

  //function to parse JWT token
  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    return JSON.parse(jsonPayload);
  }
}
