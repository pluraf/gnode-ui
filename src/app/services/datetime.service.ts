import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BackendService } from '../services/backend.service';
import moment from 'moment-timezone';

export interface Settings {
  gdate: string;
  gtime: string;
  timezone: string;
  currentDateTime: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatetimeService implements OnDestroy {
  private timer: any;
  private currentDateTimeSubject = new BehaviorSubject<string>('');
  currentDateTime$ = this.currentDateTimeSubject.asObservable();

  settings: Settings = {
    gdate: '',
    gtime: '',
    timezone: '',
    currentDateTime: '',
  };

  constructor(private backendService: BackendService) {
    this.syncWithGtime();
  }

  private syncWithGtime() {
    this.backendService.getSettings().subscribe((resp) => {
      const isoDate = new Date(resp.time.iso8601);
      const gnodeDateTime = `${isoDate.toISOString().slice(0, 10)} ${isoDate.toISOString().slice(11, 19)}`;

      this.settings.currentDateTime = gnodeDateTime;
      this.settings.timezone = resp.time.timezone;
      this.currentDateTimeSubject.next(gnodeDateTime);

      this.startClock();
    });
  }

  private startClock() {
    this.timer = setInterval(() => {
      const currentMoment = moment(this.settings.currentDateTime).add(
        1,
        'second',
      );
      this.settings.currentDateTime = currentMoment.format(
        'YYYY-MM-DD HH:mm:ss',
      );
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
