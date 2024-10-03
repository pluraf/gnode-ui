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

/* import moment from 'moment-timezone'; */

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';

import { SubheaderComponent } from '../subheader/subheader.component';
import { BackendService } from '../../services/backend.service';
import { DatetimeService } from '../../services/datetime.service';
import moment from 'moment-timezone';

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
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  backendService = inject(BackendService);
  timeService = inject(DatetimeService);

  tzNames = moment.tz.names();
  selectedTz: string = 'UTC';
  currentDateTime = '';
  autoSyncEnabled: boolean = false;
  manualDate: string = '';
  manualTime: string = '';

  @Output() currentDateTimeChange = new EventEmitter<string>();
  @Input() showDateTime: string = '';

  settings = {
    allow_anonymous: false,
    autoSetTime: false,
  };

  constructor() {
    this.currentDateTime = this.timeService.getCurrentTime(this.selectedTz);
    this.backendService.loadSettings().subscribe((resp) => {
      this.settings = resp;
    });
    this.timeZoneChanged('Europe/Stockholm');
  }
  updateDateTime(timeZone: string): void {
    const currentTime = new Date().getTime();
    this.currentDateTime = this.timeService.getCurrentTime(timeZone);
  }

  setManualDateTime(): void {
    const date = new Date(`${this.manualDate}T${this.manualTime}`);
    this.currentDateTime = isNaN(date.getTime())
      ? this.timeService.getCurrentTime(this.selectedTz)
      : moment(date).format('YYYY-MM-DD HH:mm:ss');
    this.currentDateTimeChange.emit(this.currentDateTime);
  }

  timeZoneChanged(timeZone: string): void {
    this.selectedTz = timeZone;
    this.updateDateTime(timeZone);
    this.currentDateTimeChange.emit(this.currentDateTime);
  }
  formatTimeZone(timeZone: string): string {
    return this.timeService.formatTimeZone(timeZone);
  }
  onSubmit() {
    this.backendService.updateSettings(this.settings).subscribe((resp) => {});
  }
}
