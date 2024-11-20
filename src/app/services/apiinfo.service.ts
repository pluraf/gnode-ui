import { inject, Injectable, signal } from '@angular/core';
import { ApiInfo } from './service';
import { ApiService } from './api.service';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiinfoService {
  apiService = inject(ApiService);

  apiInfoData = signal<ApiInfo>({
    mode: '',
    version: '',
    serial_number: '',
  });

  constructor() {
    this.loadApiInfo();
  }

  loadApiInfo() {
    this.apiService
      .getApiInfo()
      .pipe(
        tap((response: ApiInfo) => {
          this.apiInfoData.set(response);
        }),
        catchError((error) => {
          console.error('API call failed', error);
          return of(null);
        }),
      )
      .subscribe();
  }
}
