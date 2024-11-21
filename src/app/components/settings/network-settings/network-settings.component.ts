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
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';

interface Ipv4Settings {
  address: string;
  netmask: string;
  gateway: string;
  dns: string;
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
    TabViewModule,
    DividerModule,
    TableModule,
  ],
  providers: [MessageService],
  templateUrl: './network-settings.component.html',
  styleUrl: './network-settings.component.css',
})
export class NetworkSettingsComponent {
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  settingsService = inject(SettingsService);

  availableWifi: any[] = [];
  wifiPassword: string = '';

  isLoaded = false;

  isStarting = true;

  isStopping = true;

  OnStartSpinner() {}

  OnStopSpinner() {}

  selWifiSecurity = '';
  selWifiSignal = '';
  selWifiRate = '';
  wifiConnectionStatus = '';
  wifiActiveSSID = '';
  wifiEnabled: boolean = false;
  selSSID: any;
  allSSID: string[] = [];
  allWifi: any[] = [];
  allActive: any[] = [];

  ethernet: Ehternet;

  ipv4_method = 'auto';
  ipv4_settings: Ipv4Settings = {
    address: '',
    netmask: '',
    gateway: '',
    dns: '',
  };

  ipv4SettingsCurrent: Ipv4Settings = {
    address: '',
    netmask: '',
    gateway: '',
    dns: '',
  };

  constructor() {
    this.ethernet = new Ehternet();
    this.load();
  }

  load() {
    this.settingsService.loadSettingsData().subscribe((resp) => {
      this.wifiEnabled = resp.network_settings.wifi_state === 'enabled';
      this.ethernet.isEnabled =
        resp.network_settings.ethernet_state === 'enabled';
      if (!this.wifiEnabled) {
        this.ipv4SettingsCurrent = {
          address: '',
          netmask: '',
          gateway: '',
          dns: '',
        };
      }
      this.allSSID = resp.network_settings.available_wifi.map(
        (wifi: any) => wifi.ssid,
      );
      this.allWifi = resp.network_settings.available_wifi.reduce(
        (acc: any, wifi: any) => {
          acc[wifi.ssid] = wifi;
          return acc;
        },
        {},
      );

      this.ethernet.isConnected = false;
      this.allActive = resp.network_settings.active_connections.reduce(
        (acc: any, conn: any) => {
          acc[conn.name] = conn;
          if (conn.type == 'wifi') {
            this.ipv4_method = conn.ipv4_method;
            this.wifiActiveSSID = conn.name;
            this.wifiConnectionStatus = 'connected';
            this.selSSID = this.wifiActiveSSID;
            this.selWifiSecurity = this.allWifi[this.selSSID]['security'];
            this.selWifiSignal = this.allWifi[this.selSSID]['signal'];
            this.selWifiRate = this.allWifi[this.selSSID]['rate'];
            this.ipv4SettingsCurrent = Object.assign({}, conn.ipv4_settings);
            this.ipv4_settings = conn.ipv4_settings;
          } else if (conn.type == 'ethernet') {
            this.ethernet.isConnected = true;
            this.ethernet.ipv4Method = conn.ipv4_method;
            this.ethernet.ipv4SettingsCurrent = Object.assign(
              {},
              conn.ipv4_settings,
            );
            this.ethernet.ipv4Settings = conn.ipv4_settings;
          }
          return acc;
        },
        {},
      );
      this.isLoaded = true;
    });
  }

  onChangeSSID(event: any) {
    this.selWifiSecurity = this.allWifi[this.selSSID]['security'];
    this.selWifiSignal = this.allWifi[this.selSSID]['signal'];
    this.selWifiRate = this.allWifi[this.selSSID]['rate'];
  }

  onRescan() {
    this.load();
  }

  onConnectWifi() {
    this.apiService
      .updateSettings({
        network_settings: {
          type: 'wifi',
          ssid: this.selSSID,
          password: this.wifiPassword,
        },
      })
      .subscribe((resp) => {
        this.load();
      });
  }

  onSubmitWifi() {
    let network_settings: any = {
      network_settings: {
        type: 'wifi',
        ipv4_method: this.ipv4_method,
      },
    };
    if (this.ipv4_method === 'manual') {
      network_settings['network_settings']['ipv4_settings'] =
        this.ipv4_settings;
    }
    this.apiService.updateSettings(network_settings).subscribe((resp) => {
      this.load();
    });
  }

  onEnableWifi() {
    this.apiService
      .updateSettings({
        network_settings: { wifi_state: 'enabled' },
      })
      .subscribe((resp) => {
        this.load();
      });
  }

  onDisableWifi() {
    this.apiService
      .updateSettings({
        network_settings: { wifi_state: 'disabled' },
      })
      .subscribe((resp) => {
        this.load();
      });
  }

  onSubmitEthernet() {
    let network_settings: any = {
      network_settings: {
        type: 'ethernet',
        ipv4_method: this.ethernet.ipv4Method,
      },
    };
    if (this.ethernet.ipv4Method === 'manual') {
      network_settings['network_settings']['ipv4_settings'] =
        this.ethernet.ipv4Settings;
    }
    this.apiService.updateSettings(network_settings).subscribe((resp) => {
      this.load();
    });
  }

  handleMessage(severity: 'success' | 'error', detail: string) {
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

class Ehternet {
  isEnabled: boolean = false;
  isConnected: boolean = false;
  ipv4Method: string = '';
  ipv4SettingsCurrent: Ipv4Settings = {
    address: '',
    netmask: '',
    gateway: '',
    dns: '',
  };
  ipv4Settings: Ipv4Settings = {
    address: '',
    netmask: '',
    gateway: '',
    dns: '',
  };

  constructor() {}
}
