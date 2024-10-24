import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import moment from 'moment-timezone';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';

import { SubheaderComponent } from '../subheader/subheader.component';
import { BackendService } from '../../services/backend.service';
import { DatetimeService } from '../../services/datetime.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    CommonModule,
    FormsModule,
    DividerModule,
    SubheaderComponent,
    CalendarModule,
    ToastModule,
    TabViewModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  providers: [MessageService],
})
export class SettingsComponent implements OnInit, OnDestroy {
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

  networkSettings: any;
  availableWifi: any[] = [];
  ssid: string = '';
  password: string = '';
  activeConnections: any[] = [];
  fetchingStatus: string = '';

  settings = {
    allow_anonymous: false,
    allow_gnode_cloud: false,
    autoSetTime: false,
  };

  constructor() {
    this.backendService.loadSettings().subscribe((resp) => {
      this.settings = resp;
    });
  }

  ngOnInit() {
    //this.getNetworkSettings();
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
      auto_set_time: this.autoSyncEnabled,
      timezone: this.selectedAutoTz,
    };

    if (this.autoSyncEnabled) {
      gnodeTime.time_server = this.ntpServer;
    } else {
      gnodeTime.date = this.manualDate;
      gnodeTime.time = this.manualTime;
    }

    const payload = {
      allow_anonymous: this.settings.allow_anonymous,
      gnode_time: gnodeTime,
    };

    this.backendService.updateSettings(payload).subscribe(
      () => {
        this.handleMessage('success', 'Submitted successfully');
      },
      (error: any) => {
        this.handleMessage(
          'error',
          error.status === 500 ? error.error : error.error.detail,
        );
      },
    );
  }

  handleMessage(severity: 'success' | 'error', detail: string) {
    this.messageService.add({ severity, detail });
    this.loading = true;

    setTimeout(() => {
      this.messageService.clear();
      this.loading = false;
    }, 3000);
  }

  restartClock() {
    clearInterval(this.timer);
    this.startClock();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  /*   // Fetch network settings on load
  getNetworkSettings(): void {
    this.backendService.getNetworkSettings().subscribe(
      (response) => {
        this.networkSettings = response.network_settings;
        this.availableWifi = this.networkSettings.available_wifi;
        this.activeConnections = this.networkSettings.active_connections;
        this.fetchingStatus = this.networkSettings.fetching_status;
      }
    );
  }

  connectToWifi(): void {
    if (this.ssid && this.password) {
      this.backendService.connectToWifi(this.ssid, this.password).subscribe(
        (response) => {
          console.log('Successfully connected to WiFi', response);
          this.getNetworkSettings();}

          }
  } */
}
