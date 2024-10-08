import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private token = '';
  private isAdmin: boolean = false;
  private isLoggedIn: boolean = false;

  http = inject(HttpClient);
  constructor(private cookies: CookieService) {
    const storedToken = this.cookies.get('access_token');
    const storedAdminStatus = this.cookies.get('is_admin') === 'true';

    if (storedToken) {
      this.token = storedToken;
      this.isLoggedIn = true;
      this.isAdmin = storedAdminStatus;
    }
  }

  cookieOptions: CookieOptions = {
    secure: !isDevMode(),
    sameSite: 'Lax',
  };

  login(token: string, username: string) {
    const user = this.parseJwt(token);
    this.cookies.set('access_token', token, this.cookieOptions);
    this.setAdminStatus(user.is_admin);

    this.token = token;
    this.isLoggedIn = true;
    this.cookies.set('username', username);
  }

  getUsername(): string | null {
    return this.cookies.get('username') || null;
  }

  logout() {
    this.cookies.delete('access_token', '/');
    this.cookies.delete('is_admin', '/');

    this.isLoggedIn = false;
    this.cookies.delete('username');
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

  // Function to fetch list of users from API
  getUsers(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get('api/user/', { headers });
    } else {
      throw new Error('Authorization token is required');
    }
  }

  // Function to delete users from user list
  deleteUsers(userIds: string[]): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return this.http.delete(`api/user/`, {
        headers,
        body: userIds,
      });
    } else {
      throw new Error('Authorization token is required');
    }
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
