import { Component, inject, OnInit, OnDestroy, effect, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { DatetimeService } from '../../../services/datetime.service';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
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
    DropdownModule
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

  tzNames = [];
  ntpServers = [
    "pool.ntp.org",
    "time.google.com",
    "time.cloudflare.com"
  ]
  selectedManualTz: string = '';
  loading: boolean = false;
  ntpServer: string = '';
  timer: any;

  settings = {
    autoSetTime: false,
    timezone: '',
    gnodeDate: '',
    gnodeTime: '',
  };

  constructor() {
    this.apiService.getTimeZones().subscribe((resp) => {
      this.tzNames = resp;
    });
    effect(() => {
      const serverDateTime = this.settingsService.settingsdata().time;
      this.settings.autoSetTime = serverDateTime.auto;
      this.settings.timezone = serverDateTime.timezone;
      const dt = DateTime.fromJSDate(
        new Date(serverDateTime.iso8601), {zone: serverDateTime.timezone}
      );
      this.settings.gnodeDate = dt.toFormat('yyyy-MM-dd');
      this.settings.gnodeTime = dt.toFormat('HH:mm');
    });
  }

  ngOnInit() {}

  toggleAutoSync() {
    if (this.settings.autoSetTime) {
      this.settings.gnodeDate = '';
      this.settings.gnodeTime = '';
    }
  }

  onSubmit() {
    const gnodeTime: any = {
      automatic: this.settings.autoSetTime,
      timezone: this.settings.timezone
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
      },
      (error: any) => {
        const errorMsg = error.error.detail;
        this.handleMessage('error', errorMsg, true);
      }
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
        this.settingsService.loadSettingsDataFromsignal();
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
