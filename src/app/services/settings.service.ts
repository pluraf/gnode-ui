import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Settings } from './service';
import { ApiService } from './api.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<Settings | null>(null);
  public settings$: Observable<Settings | null> =
    this.settingsSubject.asObservable();

  settingsdata = signal<Settings>({
    allow_anonymous: false,
    time: {
      timestamp: 0,
      iso8601: '',
      timezone: '',
    },
    network_settings: undefined,
    authentication: false,
    gcloud: false,
  });

  cookies = inject(CookieService);

  constructor(private apiService: ApiService) {
    this.loadSettingsDataFromsignal();
  }

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

  loadSettingsDataFromsignal() {
    return this.apiService
      .getSettings()
      .pipe(
        tap((response: Settings) => {
          this.settingsdata.set(response);
          const apidate = this.settingsdata().time.iso8601.slice(0, 10);
          const apitime = this.settingsdata().time.iso8601.slice(11, 16);
        }),
      )
      .subscribe();
  }

  getSettings(): Settings {
    return this.settingsdata();
  }
}
