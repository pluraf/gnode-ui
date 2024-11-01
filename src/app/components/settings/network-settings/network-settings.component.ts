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

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Ipv4Setting {
  address: string[];
  netmask: string[];
  gateway: string[];
  dns: string[];
}

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
    ReactiveFormsModule,
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
  autoSyncEnabled: boolean = false;

  availableWifi: any[] = [];
  ssid: string = '';
  password: string = '';

  settings = {
    allow_anonymous: false,
  };

  selConnectionType: any;
  wifi = '';

  ipv4_method = 'auto';
  ipv4_settings: Ipv4Setting[] = [
    {
      address: [''],
      netmask: [''],
      gateway: [''],
      dns: [''],
    },
  ];

  onChangeConnectorType(event: any) {}

  onSubmit() {
    this.loading = true;

    const payload = this.createPayload();

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
  private createPayload() {
    return {
      network_setting: this.networkSetting,
      ipv4_settings: this.ipv4_settings,
    };
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
