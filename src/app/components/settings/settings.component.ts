import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

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
export class SettingsComponent {
  backendService = inject(BackendService);
  timeService = inject(DatetimeService);

  tzNames = moment.tz.names();
  selectedTz: string = 'Europe/Stockholm';
  currentDateTime = '';
  autoSyncEnabled: boolean = false;
  manualDate: string = '';
  manualTime: string = '';
  datetime12h: Date[] | undefined;
  successMessage: string = '';
  loading: boolean = false;
  ntpServer: string = '';

  @Output() currentDateTimeChange = new EventEmitter<{
    dateTime: string;
    timeZone: string;
  }>();

  @Input() showDateTime: string = 'Europe/Stockholm';

  settings = {
    allow_anonymous: false,
    allow_gnode_cloud: false,
    autoSetTime: false,
  };

  constructor(private messageService: MessageService) {
    this.loadGNodeTime();
    this.timeZoneChanged(this.selectedTz);
  }

  loadGNodeTime() {
    this.backendService.loadSettings().subscribe((resp) => {
      this.settings = resp;
      this.currentDateTime = this.timeService.getCurrentTime(this.selectedTz);
    });
  }

  setManualDateTime(): void {
    if (this.manualDate && this.manualTime) {
      const dateTimeString = `${this.manualDate}T${this.manualTime}`;
      const date = new Date(dateTimeString);
      if (!isNaN(date.getTime())) {
        this.currentDateTime = moment(date)
          .tz(this.selectedTz)
          .format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.currentDateTime = this.timeService.getCurrentTime(this.selectedTz);
      }
    } else {
      this.currentDateTime = this.timeService.getCurrentTime(this.selectedTz);
    }
    this.currentDateTimeChange.emit({
      dateTime: this.currentDateTime,
      timeZone: this.selectedTz,
    });
  }

  timeZoneChanged(timeZone: string): void {
    this.selectedTz = timeZone;
    this.updateDateTime(timeZone);
    this.currentDateTimeChange.emit({
      dateTime: this.currentDateTime,
      timeZone: this.selectedTz,
    });
  }

  updateDateTime(timeZone: string): void {
    this.currentDateTime = this.timeService.getCurrentTime(timeZone);
  }

  toggleAutoSync(): void {
    if (this.autoSyncEnabled) {
      this.ntpServer = '';
    } else {
      this.manualDate = '';
      this.manualTime = '';
    }
  }

  onSubmit() {
    this.loading = true;
    const payload: any = {
      allow_anonymous: this.settings.allow_anonymous,
      allow_gnode_cloud: this.settings.allow_gnode_cloud,
      gnode_time: {
        timezone: this.selectedTz,
        automatic: this.autoSyncEnabled,
      },
    };

    if (this.autoSyncEnabled && this.ntpServer) {
      payload.gnode_time.ntp_server = this.ntpServer;
    } else if (!this.autoSyncEnabled && this.manualDate && this.manualTime) {
      payload.gnode_time.date = this.manualDate;
      payload.gnode_time.time = this.manualTime;
    }
    this.backendService.updateSettings(payload).subscribe(
      (resp) => {
        this.handleMessage('success', 'Setting submitted successfully');
      },
      (error: any) => {
        const errorMessage = error?.error;
        this.handleMessage('error', errorMessage);
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
}
