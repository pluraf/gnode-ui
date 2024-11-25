import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Settings } from './service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settingsdata = signal<Settings>({
    allow_anonymous: false,
    time: {
      timestamp: 0,
      iso8601: '',
      timezone: '',
      formattedDateTime: '',
    },
    network_settings: undefined,
    authentication: false,
    gcloud: false,
  });

  constructor(private apiService: ApiService) {
    this.loadSettingsDataFromsignal();
  }

  loadSettingsDataFromsignal() {
    return this.apiService
      .getSettings()
      .pipe(
        tap((response: Settings) => {
          this.settingsdata.set(response);
        }),
      )
      .subscribe();
  }

  getSettings(): Settings {
    return this.settingsdata();
  }
}
