import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);

  private usersSubject = new BehaviorSubject<any>(null);
  public users$: Observable<any | null> = this.usersSubject.asObservable();

  constructor() {}
  userIds: string[] = [];

  getUsername() {
    this.apiService.getUsers().subscribe((res: any) => {
      this.usersSubject.next(res);
    });
  }

  deleteUsers(): Observable<any> {
    return this.apiService.deleteUsers(this.userIds).pipe((response) => {
      return response;
    });
  }

  createNewUsers(userObj: any): Observable<any> {
    return this.apiService.createUsers(userObj);
  }
}
