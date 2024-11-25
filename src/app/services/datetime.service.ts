import {
  ChangeDetectorRef,
  computed,
  effect,
  inject,
  Injectable,
  OnDestroy,
  Signal,
  signal,
  NgZone,
} from '@angular/core';
import { SettingsService } from './settings.service';
import { ApiinfoService } from './apiinfo.service';

export interface TimeSettings {
  gdate: string;
  gtime: string;
  timezone: string;
  formattedDateTime?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatetimeService implements OnDestroy {
  settingsService = inject(SettingsService);
  apiInfoService = inject(ApiinfoService);

  timer: any;
  timeSettingSignal = signal<TimeSettings>({
    gdate: '',
    gtime: '',
    timezone: '',
    formattedDateTime: '',
  });

  timeSettings: Signal<TimeSettings> = computed(() => this.timeSettingSignal());

  constructor() {
    effect(
      () => {
        const timeData = this.settingsService.settingsdata().time;
        let formattedTime = '';

        if (timeData?.iso8601) {
          const { date, time } = this.parseIso8601(timeData.iso8601);
          formattedTime = this.format12HourTime(time);
        }

        const gdate = timeData?.iso8601
          ? new Date(timeData.iso8601).toISOString().slice(0, 10)
          : '';

        let formattedDateTime =
          gdate && formattedTime ? `${gdate} ${formattedTime}` : '';
        this.timeSettingSignal.set({
          gdate,
          gtime: formattedTime,
          timezone: timeData?.timezone || 'UTC',
          formattedDateTime,
        });
        this.timer = setInterval(() => {
          this.startClock();
        }, 1000);
      },
      { allowSignalWrites: true },
    );
  }

  private parseIso8601(isoString: string): { date: string; time: string } {
    const [datePart, timePart] = isoString.split('T');
    const timeWithoutZ = timePart.replace('Z', '');
    return { date: datePart, time: timeWithoutZ };
  }

  private format12HourTime(time: string): string {
    const [hourStr, minute, second] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    return `${hour}:${minute}:${second} ${period}`;
  }

  updateDateTime(newDateTime: string, newTimeZone?: string) {
    const timezone = newTimeZone || this.timeSettingSignal().timezone;
    const { date, time } = this.parseIso8601(newDateTime);
    const formattedTime = this.format12HourTime(time);
    const gdate = date;
    const formattedDateTime = `${gdate} ${formattedTime}`;

    // Update the signal state
    this.timeSettingSignal.set({
      gdate,
      gtime: formattedTime,
      timezone,
      formattedDateTime,
    });

    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.startClock();
    }, 1000);
  }

  //Starts the clock to update the time every second.
  private startClock() {
    this.timer = setInterval(() => {
      const current = this.timeSettingSignal();
      const currentDateTime = current.formattedDateTime
        ? new Date(current.formattedDateTime)
        : new Date();

      currentDateTime.setSeconds(currentDateTime.getSeconds() + 1);
      const updatedGdate = currentDateTime.toISOString().slice(0, 10);

      // const formattedTime = this.format12HourTime(currentDateTime);

      let hours = currentDateTime.getHours();
      const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
      const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');

      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const updatedGtime = `${hours}:${minutes}:${seconds} ${period}`;

      const formattedDateTime = `${updatedGdate} ${updatedGtime}`;

      // Update the signal with the new values
      this.timeSettingSignal.set({
        ...current,
        gtime: updatedGtime,
        gdate: updatedGdate,
        formattedDateTime,
      });
    }, 1000);
  }

  /*   startClock() {
    const timeData = this.settingsService.settingsdata().time;

    if (timeData?.iso8601) {
      const { date, time } = this.parseIso8601(timeData.iso8601);
      const formattedTime = this.format12HourTime(time);

      const gdate = timeData?.iso8601
        ? new Date(timeData.iso8601).toISOString().slice(0, 10)
        : '';

      const updatedFormattedDateTime =
        gdate && formattedTime ? `${gdate} ${formattedTime}` : '';

      // Update only the parts of the signal that change
      this.timeSettingSignal.set({
        gdate,
        gtime: formattedTime,
        timezone: timeData?.timezone || 'UTC',
        formattedDateTime: updatedFormattedDateTime,
      });
    }
  } */

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
