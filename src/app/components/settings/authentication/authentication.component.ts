import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
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
  providers: [MessageService],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  settingsService = inject(SettingsService);
  messageService = inject(MessageService);
  router = inject(Router);

  settings = {
    isAuthentication: false,
  };

  constructor() {
    effect(() => {
      this.settings.isAuthentication = this.settingsService.settingsdata().authentication;
    });
  }

  onSubmit() {
    if (this.settings.isAuthentication == this.settingsService.settingsdata().authentication) {
      return;
    }

    const payload = {
      authentication: this.settings.isAuthentication,
    };

    this.apiService.updateSettings(payload).subscribe({
      next: (v) => {
        if (!this.settings.isAuthentication) {
          this.settingsService.load();
        }
        this.authService.logout();
      },
      error: (error) => this.handleMessage('error', error.error.detail, true)
    });
  }

  handleMessage(
    severity: 'success' | 'error',
    detail: string,
    sticky: boolean,
  ) {
    this.messageService.add({ severity, detail });
    if (severity === 'success') {
      setTimeout(() => {
        this.clear();
      }, 3000);
    } else if (severity === 'error') {
      this.messageService.add({ severity, detail, sticky: true });
    }
  }

  clear() {
    this.messageService.clear();
  }
}
