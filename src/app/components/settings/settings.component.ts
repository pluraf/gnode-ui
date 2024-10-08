import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import moment from 'moment-timezone';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';

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
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
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

  @Output() currentDateTimeChange = new EventEmitter<{
    dateTime: string;
    timeZone: string;
  }>();

  @Input() showDateTime: string = 'Europe/Stockholm';

  settings = {
    allow_anonymous: false,
    autoSetTime: false,
  };

  constructor() {
    this.currentDateTime = this.timeService.getCurrentTime(this.selectedTz);
    this.backendService.loadSettings().subscribe((resp) => {
      this.settings = resp;
    });
    this.timeZoneChanged(this.selectedTz);
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
  formatTimeZone(timeZone: string): string {
    return this.timeService.formatTimeZone(timeZone);
  }
  onSubmit() {
    this.backendService.updateSettings(this.settings).subscribe((resp) => {});
  }
}
