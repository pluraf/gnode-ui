import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { ApiService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    FormsModule,
    ToastModule,
    ButtonModule,
    CheckboxModule,
    SubheaderComponent,
  ],
  providers: [MessageService, Router],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent {
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  settingsService = inject(SettingsService);
  router = inject(Router);

  loading: boolean = false;

  settings = {
    isAuthentication: false,
  };

  constructor() {}
  settingsFromSignal = this.settingsService.settingsdata;

  onSubmit() {
    const payload = {
      authentication: this.settingsFromSignal().authentication,
    };

    this.settingsFromSignal.set({
      ...this.settingsFromSignal(),
      authentication: this.settingsFromSignal().authentication,
    });

    this.apiService.updateSettings(payload).subscribe(
      () => {
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
    severity: 'success' | 'error',
    detail: string,
    sticky: boolean,
  ) {
    this.messageService.add({ severity, detail });
    if (severity === 'success') {
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
