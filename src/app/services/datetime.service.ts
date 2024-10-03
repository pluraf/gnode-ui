import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DatetimeService {
  constructor() {}
  getCurrentTime(timeZone: string): string {
    return moment.tz(timeZone).format('lll');
  }

  formatTimeZone(timeZone: string): string {
    const offset = moment.tz(timeZone).utcOffset();
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset) / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    return `UTC${sign}${hours}:${minutes} (${timeZone})`;
  }
}
