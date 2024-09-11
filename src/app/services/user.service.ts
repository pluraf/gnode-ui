import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private token = '';
  private isAdmin: boolean = false;
  private isLoggedIn: boolean = false;

  constructor(private cookies: CookieService) {
    const storedToken = this.cookies.get('access_token');
    const storedAdminStatus = this.cookies.get('is_admin') === 'true';

    if (storedToken) {
      this.token = storedToken;
      this.isLoggedIn = true;
      this.isAdmin = storedAdminStatus;
    }
  }

  login(token: string) {
    const user = this.parseJwt(token);
    this.cookies.set('access_token', token, {
      path: '/',
      secure: true,
      sameSite: 'Lax',
    });
    this.setAdminStatus(user.is_admin);

    this.token = token;
    this.isLoggedIn = true;
  }

  logout() {
    this.cookies.delete('access_token', '/');
    this.cookies.delete('is_admin', '/');

    this.token = '';
    this.isAdmin = false;
    this.isLoggedIn = false;
  }

  setAdminStatus(status: boolean) {
    this.cookies.set('is_admin', String(status));
    this.isAdmin = status;
  }
  getAdminStatus(): boolean {
    return this.isAdmin;
  }

  getToken(): string {
    return this.token;
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
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
