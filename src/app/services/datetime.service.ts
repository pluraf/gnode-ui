import {
  computed,
  effect,
  inject,
  Injectable,
  OnDestroy,
  Signal,
  signal,
} from '@angular/core';
import { SettingsService } from './settings.service';
import { ApiinfoService } from './apiinfo.service';

export interface TimeSettings {
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
  apiInfoService = inject(ApiinfoService);

  private timer: any;
  settingsTimeSignal = signal<TimeSettings>({
    gdate: '',
    gtime: '',
    timezone: '',
    currentDateTime: '',
  });

  settingsFromSignal = this.settingsService.settingsdata;
  apiInfoSignal = this.apiInfoService.apiInfoData;

  settings: Signal<TimeSettings> = computed(() => this.settingsTimeSignal());

  constructor() {
    effect(
      () => {
        const settingsData = this.settingsService.settingsdata();
        if (settingsData && settingsData.time?.iso8601) {
          const isoDate = settingsData.time.iso8601;
          const gdate = isoDate.slice(0, 10);
          const dateObj = new Date(isoDate);
          const formattedTime = new Intl.DateTimeFormat('en-EU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(dateObj);

          this.settingsTimeSignal.set({
            gdate,
            gtime: formattedTime,
            timezone: settingsData.time.timezone,
            currentDateTime: `${gdate} ${formattedTime}`,
          });
        }
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      const apiInfo = this.apiInfoSignal();
      if (apiInfo.mode) {
        if (apiInfo.mode === 'physical') {
          this.startClock();
        }
      }
    });
  }

  private startClock() {
    this.timer = setInterval(() => {
      this.settingsTimeSignal.update((current) => {
        let currentTime = new Date(current.currentDateTime);

        if (isNaN(currentTime.getTime())) {
          currentTime = new Date();
        }
        currentTime.setSeconds(currentTime.getSeconds() + 1);
        return {
          ...current,
          currentDateTime: currentTime.toISOString(),
          gtime: currentTime.toISOString().slice(11, 16),
          gdate: currentTime.toISOString().slice(0, 10),
        };
      });
    }, 1000);
  }

  updateDateTime(newDateTime: string) {
    const dateObj = new Date(newDateTime);
    const formattedTime = new Intl.DateTimeFormat('en-EU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(dateObj);

    const gdate = newDateTime.slice(0, 10);
    const gtime = formattedTime;
    this.settingsTimeSignal.set({
      gdate,
      gtime,
      timezone: this.settingsTimeSignal().timezone,
      currentDateTime: `${gdate} ${gtime}`,
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
