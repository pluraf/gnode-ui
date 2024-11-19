import { Component, inject } from '@angular/core';
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

  constructor() {
    this.settingsService.loadSettingsData().subscribe((resp) => {
      this.isGCloudEnabled = resp.gcloud;
    });
  }

  onSubmit() {
    const payload = {
      gcloud: this.isGCloudEnabled,
    };

    this.apiService.updateSettings(payload).subscribe((resp) => {});
  }

  handleMessage(
    severity: 'success' | 'error',
    detail: string,
    sticky: boolean,
  ) {
    if (severity === 'success') {
      this.messageService.add({ severity, detail });
      this.loading = true;
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
}
