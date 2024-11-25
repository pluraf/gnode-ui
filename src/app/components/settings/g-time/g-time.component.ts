/* import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
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
    gnodeDate: '',
    gnodeTime: '',
    currentDateTime: '',
  };

  timeSettingsSignal = this.dateTimeService.timeSettings;

  constructor() {
    effect(() => {
      const timeSettings = this.timeSettingsSignal();
      if (timeSettings.currentDateTime) {
        this.settings.currentDateTime = `${timeSettings.gdate} ${timeSettings.gtime}`;
        this.settings.gnodeDate = timeSettings.gdate;
        this.settings.gnodeTime = timeSettings.gtime;
        this.settings.timezone = timeSettings.timezone;
      }
    });
    this.loadInitialDateTime();
  }

  ngOnInit() {}

  loadInitialDateTime() {
    effect(() => {
      const time = this.settingsService.settingsdata().time;
      const gdate = time.iso8601.slice(0, 10);
      const gtime = new Intl.DateTimeFormat('en-EU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date(time.iso8601));

      this.settings.gnodeDate = gdate;
      this.settings.gnodeTime = gtime;
      this.settings.timezone = time.timezone;
      this.settings.currentDateTime = `${gdate} ${gtime}`;
      this.dateTimeService.updateDateTime(`${gdate} ${gtime}`);

      this.startClock();
    });
  }

  startClock() {
    this.timer = setInterval(() => {}, 1000);
  }

  toggleAutoSync() {
    this.settings.autoSetTime = !this.settings.autoSetTime;
    if (this.settings.autoSetTime) {
      this.settings.gnodeDate = '';
      this.settings.gnodeTime = '';
    }
    this.updateCurrentDateTime();
  }

  setManualDateTime() {
    if (this.settings.gnodeDate && this.settings.gnodeTime) {
      const dateTimeString = `${this.settings.gnodeDate} ${this.settings.gnodeTime}`;
      this.settings.currentDateTime = dateTimeString;
      this.dateTimeService.updateDateTime(this.settings.currentDateTime);
    }
  }

  updateCurrentDateTime() {
    if (this.settings.autoSetTime) {
      const now = new Date().toISOString();
      this.settings.currentDateTime = `${now.slice(0, 10)} ${now.slice(11, 16)}`;
    } else {
      if (this.settings.gnodeDate && this.settings.gnodeTime) {
        const dateTimeString = `${this.settings.gnodeDate} ${this.settings.gnodeTime}`;
        this.settings.currentDateTime = dateTimeString;
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
      gnodeTime.date = this.settings.gnodeDate;
      gnodeTime.time = this.settings.gnodeTime;
    }

    const payload = {
      gnode_time: gnodeTime,
    };
    this.apiService.updateSettings(payload).subscribe(
      () => {
        this.handleMessage('success', 'Submitted successfully', false);
        const updatedDateTime = `${this.settings.gnodeDate} ${this.settings.gnodeTime}`;
        this.dateTimeService.updateDateTime(updatedDateTime);
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
 */
