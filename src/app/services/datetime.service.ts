import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatetimeService {
  currentDateTimeSubject = new BehaviorSubject<string>(
    this.getInitialDateTime(),
  );

  currentDateTime$ = this.currentDateTimeSubject.asObservable();

  constructor() {}

  updateDateTime(newDateTime: string) {
    this.currentDateTimeSubject.next(newDateTime);
  }

  getInitialDateTime(): string {
    const manualDate = localStorage.getItem('manualDate');
    const manualTime = localStorage.getItem('manualTime');
    const manualTimestamp = localStorage.getItem('manualTimestamp');
    if (manualDate && manualTime && manualTimestamp) {
      const manualDateTime = moment(`${manualDate}T${manualTime}`);
      const elapsedTime = Date.now() - parseInt(manualTimestamp);
      return manualDateTime.add(elapsedTime, 'milliseconds').format('lll');
    }
    return moment().format('lll');
  }
}
