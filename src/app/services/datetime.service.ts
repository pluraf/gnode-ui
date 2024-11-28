import {
  computed,
  effect,
  inject,
  Injectable,
  OnDestroy,
  signal,
} from '@angular/core';
import { SettingsService } from './settings.service';
import { ApiinfoService } from './apiinfo.service';


@Injectable({
  providedIn: 'root',
})
export class DatetimeService implements OnDestroy {
  settingsService = inject(SettingsService);
  apiInfoService = inject(ApiinfoService);

  timer: any;
  timeSettingSignal = signal<Date>(new Date(0));

  constructor() {
    effect(
      () => {
        const timeData = this.settingsService.settingsdata().time;
        if (timeData.iso8601) {
          this.timeSettingSignal.set(new Date(timeData.iso8601));
        }
      },
      { allowSignalWrites: true },
    );
    this.startClockIf();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  //Starts the clock to update the time every second.
  private startClockIf() {
    if (this.timer) {
      return;
    }
    this.timer = setInterval(() => {
      const current = this.timeSettingSignal();
      current.setMinutes(current.getMinutes() + 1);
      this.timeSettingSignal.set(current);
    }, 60 * 1000);
  }

}
