import { Component, inject } from '@angular/core';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BackendService } from '../../../services/backend.service';

@Component({
  selector: 'app-network-settings',
  standalone: true,
  imports: [
    SubheaderComponent,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    CommonModule,
    FormsModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './network-settings.component.html',
  styleUrl: './network-settings.component.css',
})
export class NetworkSettingsComponent {
  backendService = inject(BackendService);
  messageService = inject(MessageService);

  loading: boolean = false;
  networkSetting: string = '';

  onSubmit() {
    this.loading = true;

    const payload = {
      network_setting: this.networkSetting,
    };

    this.backendService.updateSettings(payload).subscribe(
      () => {
        this.handleMessage('success', 'Submitted successfully', false);
      },
      (error: any) => {
        this.handleMessage(
          'error',
          error.status === 500 ? error.error : error.error.detail,
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
    if (severity === 'success') {
      this.messageService.add({ severity, detail });
      this.loading = false;
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
