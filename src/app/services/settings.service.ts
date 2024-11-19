import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Settings } from './service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<Settings | null>(null);
  public settings$: Observable<Settings | null> =
    this.settingsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  loadSettingsData(): Observable<Settings> {
    if (this.settingsSubject.value === null) {
      return this.apiService.getSettings().pipe(
        tap((response: Settings) => {
          this.settingsSubject.next(response);
        }),
      );
    } else {
      return of(this.settingsSubject.value);
    }
  }

  getCurrentSettings(): Settings | null {
    return this.settingsSubject.value;
  }
}
