import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import moment from 'moment-timezone';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';

import { SubheaderComponent } from '../subheader/subheader.component';
import { BackendService } from '../../services/backend.service';

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

  tzNames = moment.tz.names();
  selectedTz!: string;

  settings = {
    allow_anonymous: false,
    autoSetTime: false,
  };

  constructor() {
    this.backendService.loadSettings().subscribe((resp) => {
      this.settings = resp;
    });

    this.timeZoneChanged('Europe/Stockholm');
  }

  onSubmit() {
    this.backendService.updateSettings(this.settings).subscribe();
  }

  timeZoneChanged(timeZone: string): void {
    this.selectedTz = timeZone;
  }

  formatTimeZone(timeZone: string): string {
    const offset = moment.tz(timeZone).utcOffset();
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset) / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    const formattedOffset = `UTC${sign}${hours}:${minutes}`;
    return `(${formattedOffset}) ${timeZone}`;
  }
}
