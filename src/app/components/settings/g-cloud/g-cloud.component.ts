import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';

import { SettingsService } from '../../../services/settings.service';
import { ApiService } from '../../../services/api.service';
import { SubheaderComponent } from '../../subheader/subheader.component';

@Component({
  selector: 'app-g-cloud',
  standalone: true,
  imports: [
    SubheaderComponent,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './g-cloud.component.html',
  styleUrl: './g-cloud.component.css',
})
export class GCloudComponent {
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  settingsService = inject(SettingsService);

  loading: boolean = false;
  isGCloudEnabled = false;
  gcloudFormValue: boolean = false;

  constructor() {
    effect(() => {
      this.isGCloudEnabled = this.settingsService.settingsdata().gcloud;
    });
  }

  onSubmit() {
    if (!this.isGCloudEnabled) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Are you sure?',
        detail: 'Disabling G-Node Cloud Client may affect your service.',
        sticky: true,
        life: 10000,
        key: 'confirmation',
        closable: false,
      });
    } else {
      this.executeDisable();
    }
  }

  executeDisable() {
    const payload = {
      gcloud: this.isGCloudEnabled,
    };
    this.settingsService.settingsdata.set({
      ...this.settingsService.settingsdata(),
      gcloud: this.isGCloudEnabled,
    });
    this.apiService.updateSettings(payload).subscribe(
      (resp) => {
        this.handleMessage('success', 'Submitted successfully', false);
      },
      (error) => {
        this.handleMessage(
          'error',
          error.status === 500 ? error.error.detail : error.error,
          true,
        );
      },
    );
  }

  handleMessage(
    severity: 'success' | 'error' | 'warn',
    detail: string,
    sticky: boolean,
    summary?: string,
  ) {
    if (severity === 'success') {
      this.messageService.add({ severity, detail });
      this.loading = true;
      setTimeout(() => {
        this.clear();
      }, 3000);
    } else if (severity === 'error') {
      this.messageService.add({ severity, detail, sticky: true });
    } else if (severity === 'warn') {
      this.messageService.add({
        severity,
        summary: summary || 'Warning!',
        detail,
        sticky,
      });
    }
  }

  clear() {
    this.messageService.clear();
    this.loading = false;
  }
}
