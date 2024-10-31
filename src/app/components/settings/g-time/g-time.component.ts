import { Component, inject } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { MessageService } from 'primeng/api';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DatetimeService } from '../../../services/datetime.service';
import * as moment from 'moment-timezone';

import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

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
export class GTimeComponent {
  backendService = inject(BackendService);
  dateTimeService = inject(DatetimeService);
  messageService = inject(MessageService);

  tzNames = moment.tz.names();
  selectedAutoTz: string =
    localStorage.getItem('selectedAutoTz') || 'Europe/Stockholm';
  selectedManualTz: string =
    localStorage.getItem('selectedManualTz') || 'Europe/Stockholm';
  manualDate: string = localStorage.getItem('manualDate') || '';
  manualTime: string = localStorage.getItem('manualTime') || '';
  currentDateTime = '';
  autoSyncEnabled: boolean = false;
  loading: boolean = false;
  ntpServer: string = '';
  timer: any;
  timerSubscription: Subscription | null = null;

  settings = {
    autoSetTime: false,
  };

  constructor() {
    this.backendService.loadSettings().subscribe((resp) => {
      this.settings = resp;
    });
  }

  ngOnInit() {
    this.loadInitialSettings();
    this.startClock();
  }

  loadInitialSettings() {
    this.updateCurrentDateTime();
  }

  startClock() {
    this.timer = setInterval(() => this.updateCurrentDateTime(), 1000);
  }

  toggleAutoSync(): void {
    this.autoSyncEnabled = !this.autoSyncEnabled;
    if (this.autoSyncEnabled) {
      this.manualDate = '';
      this.manualTime = '';
      localStorage.removeItem('manualDate');
      localStorage.removeItem('manualTime');
      localStorage.removeItem('manualTimestamp');
    }
    this.updateCurrentDateTime();
  }

  setManualDateTime() {
    if (this.manualDate && this.manualTime) {
      const dateTimeString = `${this.manualDate}T${this.manualTime}`;
      const manualDateTime = moment.tz(dateTimeString, this.selectedManualTz);
      this.currentDateTime = manualDateTime.format('lll');
      localStorage.setItem('manualDate', this.manualDate);
      localStorage.setItem('manualTime', this.manualTime);
      localStorage.setItem('manualTimestamp', Date.now().toString());
      localStorage.setItem('selectedManualTz', this.selectedManualTz);

      this.dateTimeService.updateDateTime(this.currentDateTime);
    }
  }

  updateCurrentDateTime() {
    if (this.autoSyncEnabled) {
      this.currentDateTime = moment.tz(this.selectedAutoTz).format('lll');
    } else {
      if (this.manualDate && this.manualTime) {
        const dateTimeString = `${this.manualDate}T${this.manualTime}`;
        const manualDateTime = moment.tz(dateTimeString, this.selectedManualTz);
        const elapsedTime =
          Date.now() - parseInt(localStorage.getItem('manualTimestamp') || '0');
        this.currentDateTime = manualDateTime
          .add(elapsedTime, 'milliseconds')
          .format('lll');
      }
    }
    this.dateTimeService.updateDateTime(this.currentDateTime);
  }

  loadGNodeTime() {
    if (!this.manualDate || !this.manualTime) {
      this.backendService.loadSettings().subscribe((resp) => {
        this.settings = resp;
        this.currentDateTime = this.dateTimeService.getInitialDateTime();
      });
    }
  }

  updateAutoTimezone(tz: string) {
    this.selectedAutoTz = tz;
    localStorage.setItem('selectedAutoTz', tz);
    this.updateCurrentDateTime();
  }

  updateManualTimezone(tz: string) {
    this.selectedManualTz = tz;
    localStorage.setItem('selectedManualTz', tz);
    this.updateCurrentDateTime();
  }

  onSubmit() {
    this.loading = true;
    const gnodeTime: any = {
      automatic: this.autoSyncEnabled,
      timezone: this.selectedAutoTz,
    };

    if (this.autoSyncEnabled) {
      gnodeTime.ntp_server = this.ntpServer;
    } else {
      gnodeTime.date = this.manualDate;
      gnodeTime.time = this.manualTime;
    }

    const payload = {
      gnode_time: gnodeTime,
    };

    this.backendService.updateSettings(payload).subscribe(
      () => {
        this.handleMessage('success', 'Submitted successfully', false);
      },
      (error: any) => {
        this.handleMessage(
          'error',
          error.status === 500 ? error.error : error.error.detail,
          true,
        );
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

  restartClock() {
    clearInterval(this.timer);
    this.startClock();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
