import { inject, Injectable } from '@angular/core';
import { ApiInfo } from './service';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiinfoService {
  private apiInfoSubject = new BehaviorSubject<ApiInfo | null>(null);
  public apiinfos$: Observable<ApiInfo | null> =
    this.apiInfoSubject.asObservable();

  apiService = inject(ApiService);

  constructor() {}

  loadApiInfo(): Observable<ApiInfo> {
    if (this.apiInfoSubject.value === null) {
      return this.apiService.getApiInfo().pipe(
        tap((response: ApiInfo) => {
          this.apiInfoSubject.next(response);
        }),
      );
    } else {
      return of(this.apiInfoSubject.value);
    }
  }

  getCurrentApiInfo(): ApiInfo | null {
    return this.apiInfoSubject.value;
  }
}
