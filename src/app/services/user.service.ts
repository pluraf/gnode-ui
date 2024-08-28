import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private token: BehaviorSubject<string | null>;
  private isAdmin: BehaviorSubject<boolean>;
  private isLoggedIn: BehaviorSubject<boolean>;

  constructor() {
    const storedToken = sessionStorage.getItem('access_token');
    const storedAdminStatus = sessionStorage.getItem('is_admin') === 'true';

    this.token = new BehaviorSubject<string | null>(storedToken);
    this.isAdmin = new BehaviorSubject<boolean>(storedAdminStatus);

    this.isLoggedIn = new BehaviorSubject<boolean>(!!storedToken);
  }

  login(token: string) {
    sessionStorage.setItem('access_token', token);
    const user = this.parseJwt(token);
    this.setAdminStatus(user.is_admin);
    this.token.next(token);
    this.isLoggedIn.next(true);
  }

  logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('is_admin');
    this.token.next(null);
    this.isAdmin.next(false);
    this.isLoggedIn.next(false);
  }

  setAdminStatus(status: boolean) {
    sessionStorage.setItem('is_admin', String(status));
    this.isAdmin.next(status);
  }
  getAdminStatus(): Observable<boolean> {
    return this.isAdmin.asObservable();
  }

  getToken(): Observable<string | null> {
    return this.token.asObservable();
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
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
