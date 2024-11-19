import {
  ChangeDetectorRef,
  inject,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment-timezone';
import { SettingsService } from './settings.service';
import { Settings } from './service';
import { ApiService } from './api.service';

export interface Settings1 {
  gdate: string;
  gtime: string;
  timezone: string;
  currentDateTime: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatetimeService implements OnDestroy {
  settingsService = inject(SettingsService);

  private timer: any;
  private currentDateTimeSubject = new BehaviorSubject<string>('');
  currentDateTime$ = this.currentDateTimeSubject.asObservable();

  settingsItem: Settings | null = null;

  settings: Settings1 = {
    gdate: '',
    gtime: '',
    timezone: '',
    currentDateTime: '',
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Fetch settings if not already fetched
    this.settingsService.loadSettingsData();

    // Subscribe to settings$
    this.settingsService.settings$.subscribe((settings) => {
      this.settingsItem = settings;
    });
  }

  private startClock() {
    this.timer = setInterval(() => {
      const currentMoment = moment(this.settings.currentDateTime).add(
        1,
        'second',
      );
      this.settings.currentDateTime = currentMoment.toISOString();
      this.currentDateTimeSubject.next(this.settings.currentDateTime);
    }, 1000);
  }

  updateDateTime(newDateTime: string) {
    this.settings.currentDateTime = newDateTime;
    this.currentDateTimeSubject.next(newDateTime);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
