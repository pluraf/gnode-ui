import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private token: string = '';
  private isAdmin: boolean = false;
  private isLoggedIn: boolean = false;

  private http = inject(HttpClient);
  private cookies = inject(CookieService);

  private cookieOptions: CookieOptions = {
    secure: window.location.protocol === 'https:',
    sameSite: 'Lax',
  };

  constructor() {
    this.loadUserFromCookies();
  }

  private loadUserFromCookies() {
    this.token = this.cookies.get('access_token') || '';
    this.isLoggedIn = !!this.token;
    this.isAdmin = this.cookies.get('is_admin') === 'true';
  }

  login(token: string, username: string): void {
    const user = this.parseJwt(token);
    this.setAuthCookies(token, user.is_admin, username);

    this.token = token;
    this.isLoggedIn = true;
    this.isAdmin = user.is_admin;
  }

  logout(): void {
    this.clearAuthCookies();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.token = '';
  }

  private setAuthCookies(
    token: string,
    isAdmin: boolean,
    username: string,
  ): void {
    this.cookies.set('access_token', token, this.cookieOptions);
    this.cookies.set('is_admin', String(isAdmin), this.cookieOptions);
    this.cookies.set('username', username, this.cookieOptions);
  }

  private clearAuthCookies(): void {
    this.cookies.delete('access_token', '/');
    this.cookies.delete('is_admin', '/');
    this.cookies.delete('username', '/');
  }

  getUsername(): string | null {
    return this.cookies.get('username') || null;
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

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token is required');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUsers(): Observable<any> {
    return this.http.get('api/user/', { headers: this.getAuthHeaders() });
  }

  deleteUsers(userIds: string[]): Observable<any> {
    return this.http.delete('api/user/', {
      headers: this.getAuthHeaders(),
      body: userIds,
    });
  }

  private parseJwt(token: string): any {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  }
}
