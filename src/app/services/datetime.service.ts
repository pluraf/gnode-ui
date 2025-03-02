import {
  computed,
  effect,
  inject,
  Injectable,
  OnDestroy,
  signal,
} from '@angular/core';
import { InfoService } from './info.service';


@Injectable({
  providedIn: 'root',
})
export class DatetimeService implements OnDestroy {
  infoService = inject(InfoService);

  timer: any;
  timeSettingSignal = signal<Date>(new Date(0));
  timezone = '';

  constructor() {
    effect(
      () => {
        const timeData = this.infoService.infoData().time;
        this.timezone = timeData.timezone;
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
