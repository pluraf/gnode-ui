import { Injectable, signal, Signal } from '@angular/core';
import { tap } from 'rxjs';
import { Settings } from './service';
import { ApiService } from './api.service';
import { InfoService } from './info.service';
import { AuthService } from './auth.service';

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
      auto: false
    },
    network_settings: undefined,
    api_authentication: false,
    gcloud: {
      https: null,
      ssh: null,
    },
  });

  constructor(private apiService: ApiService, private authService: AuthService) {
    if (authService.isLoggedIn()) {
      this.load();
    }
  }

  load(callback?: () => void) {
    return this.apiService
      .getSettings()
      .pipe(
        tap((response: Settings) => {
          this.settingsdata.set(response);
        })
      )
      .subscribe({
        next: () => { if (callback) callback() }
      });
  }
}
