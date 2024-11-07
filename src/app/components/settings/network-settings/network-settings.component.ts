import { Component, inject } from '@angular/core';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
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
    TabViewModule
  ],
  providers: [MessageService],
  templateUrl: './network-settings.component.html',
  styleUrl: './network-settings.component.css',
})
export class NetworkSettingsComponent {
  backendService = inject(BackendService);
  messageService = inject(MessageService);

  availableWifi: any[] = [];
  wifiPassword: string = '';

  loading = false;

  selWifiSecurity = '';
  selWifiSignal = '';
  selWifiRate = '';
  wifiConnectionStatus = '';
  wifiEnabled : boolean = false;
  selSSID: any;
  allSSID : string[] = [];
  allWifi : any[] = [];
  allActive : any[] = [];

  ipv4_method = 'auto';
  ipv4_settings: Ipv4Setting[] = [
    {
      address: [''],
      netmask: [''],
      gateway: [''],
      dns: [''],
    },
  ];

  constructor() {
    this.load();
  }

  load() {
    this.backendService.getSettings().subscribe((resp) => {
      this.allSSID = resp.network_settings.available_wifi.map((wifi: any) => wifi.ssid);
      this.allWifi = resp.network_settings.available_wifi.reduce((acc: any, wifi: any) => {
        acc[wifi.ssid] = wifi;
        return acc;
      }, {});
      this.allActive = resp.network_settings.active_connections.reduce((acc: any, conn: any) => {
        acc[conn.name] = conn;
        return acc;
      }, {});
    });
  }

  onChangeWifiEnabled(event: any) {
    console.log(event);
  }

  onChangeSSID(event: any) {
    this.selWifiSecurity = this.allWifi[this.selSSID]['security'];
    this.selWifiSignal = this.allWifi[this.selSSID]['signal'];
    this.selWifiRate = this.allWifi[this.selSSID]['rate'];
  }

  onRescan() {
    this.load();
  }

  onWifiConnect() {
    this.backendService.updateSettings({
      network_settings: {
        type: 'wifi',
        ssid: this.selSSID,
        password: this.wifiPassword,
      }}
    ).subscribe();
  }

  onSubmit() {
  }

  handleMessage(
    severity: 'success' | 'error',
    detail: string,
  ) {
    if (severity === 'success') {
      this.messageService.add({ severity, detail });
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
