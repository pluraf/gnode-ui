import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DatetimeService } from '../../../services/datetime.service';
import moment from 'moment-timezone';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-g-time',
  standalone: true,
  imports: [
    SubheaderComponent,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    CommonModule,
    FormsModule,
    SubheaderComponent,
    CalendarModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './g-time.component.html',
  styleUrl: './g-time.component.css',
})
export class GTimeComponent implements OnInit, OnDestroy {
  apiService = inject(ApiService);
  settingsService = inject(SettingsService);
  dateTimeService = inject(DatetimeService);
  messageService = inject(MessageService);

  tzNames = moment.tz.names();
  selectedAutoTz: string = 'Europe/Stockholm';
  selectedManualTz: string = '';
  loading: boolean = false;
  ntpServer: string = '';
  timer: any;

  settings = {
    autoSetTime: false,
    timezone: '',
    gdate: '',
    gtime: '',
    currentDateTime: '',
  };

  currentDateTime$ = this.dateTimeService.currentDateTime$;

  constructor() {
    this.dateTimeService.currentDateTime$.subscribe((currentDateTime) => {
      this.settings.currentDateTime = currentDateTime;
    });
  }

  ngOnInit() {
    this.loadInitialDateTime();
  }

  loadInitialDateTime() {
    this.settingsService.loadSettingsData().subscribe((resp) => {
      const isoDate = moment(resp.time.iso8601).tz(this.selectedAutoTz, true);

      this.settings.gdate = isoDate.format('YYYY-MM-DD');
      this.settings.gtime = isoDate.format('HH:mm');
      this.settings.timezone = resp.time.timezone;
      this.settings.currentDateTime = isoDate.format('MMM DD, YYYY hh:mm A');
      this.dateTimeService.updateDateTime(this.settings.currentDateTime);

      this.startClock();
    });
  }

  startClock() {
    this.timer = setInterval(() => {}, 1000);
  }

  /*   updateLocalClock() {
    const now = new Date();

    this.settings.gtime = now.toISOString().slice(11, 19);
    this.settings.currentDateTime = `${this.settings.gdate} ${this.settings.gtime}`;
  } */

  toggleAutoSync() {
    this.settings.autoSetTime = !this.settings.autoSetTime;
    if (this.settings.autoSetTime) {
      this.settings.gdate = '';
      this.settings.gtime = '';
    }
    this.updateCurrentDateTime();
  }

  setManualDateTime() {
    if (this.settings.gdate && this.settings.gtime) {
      const dateTimeString = `${this.settings.gdate} ${this.settings.gtime}`;
      const manualDateTime = moment.tz(dateTimeString, this.selectedManualTz);
      this.settings.currentDateTime = manualDateTime.format(
        'MMM DD, YYYY hh:mm A',
      );
      this.dateTimeService.updateDateTime(this.settings.currentDateTime);
    }
  }

  updateCurrentDateTime() {
    if (this.settings.autoSetTime) {
      this.settings.currentDateTime = moment
        .tz(this.selectedAutoTz)
        .format('MMMM DD, YYYY hh:mm A');
    } else {
      if (this.settings.gdate && this.settings.gtime) {
        const dateTimeString = `${this.settings.gdate} ${this.settings.gtime}`;
        const manualDateTime = moment.tz(dateTimeString, this.selectedManualTz);
        this.settings.currentDateTime = manualDateTime.format(
          'MMM DD, YYYY hh:mm A',
        );
      }
    }
    this.dateTimeService.updateDateTime(this.settings.currentDateTime);
  }

  updateAutoTimezone(tz: string) {
    this.selectedAutoTz = tz;
    this.updateCurrentDateTime();
  }

  updateManualTimezone(tz: string) {
    this.selectedManualTz = tz;
    this.updateCurrentDateTime();
  }

  onSubmit() {
    this.loading = true;
    const gnodeTime: any = {
      automatic: this.settings.autoSetTime,
      timezone: this.selectedAutoTz,
    };

    if (this.settings.autoSetTime) {
      gnodeTime.ntp_server = this.ntpServer;
    } else {
      gnodeTime.date = this.settings.gdate;
      gnodeTime.time = this.settings.gtime;
    }

    const payload = {
      gnode_time: gnodeTime,
    };

    this.apiService.updateSettings(payload).subscribe(
      () => {
        this.handleMessage('success', 'Submitted successfully', false);
      },
      (error: any) => {
        const errorMsg =
          error.status === 500 ? error.error.detail : error.error;
        this.handleMessage('error', errorMsg, true);
      },
    );
  }

  handleMessage(
    severity: 'success' | 'error',
    detail: string,
    sticky: boolean,
  ) {
    if (severity === 'success') {
      this.messageService.add({ severity, detail });
      this.loading = false;
      setTimeout(() => {
        this.clear();
      }, 3000);
    } else if (severity === 'error') {
      this.messageService.add({ severity, detail, sticky: true });
    }
  }

  clear() {
    this.messageService.clear();
    this.loading = false;
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
