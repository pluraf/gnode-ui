import { Component, inject, effect } from '@angular/core';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { NoteService } from '../../../services/note.service';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';

import { ReactiveFormsModule } from '@angular/forms';
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
    InputSwitchModule,
  ],
  templateUrl: './network-settings.component.html',
  styleUrl: './network-settings.component.css',
})
export class NetworkSettingsComponent {
  apiService = inject(ApiService);
  noteService = inject(NoteService);
  settingsService = inject(SettingsService);

  availableWifi: any[] = [];
  wifiPassword: string = '';

  isLoaded = false;

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
  wifiAP: WifiAP;

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
    this.wifiAP = new WifiAP();
    effect(() => this.load());
  }

  load() {
    const networkData = this.settingsService.settingsdata();
    this.wifiAP.isEnabled = networkData.network_settings.ap_state === 'enabled'
    this.wifiEnabled = networkData.network_settings.wifi_state === 'enabled';
    this.ethernet.isEnabled =
      networkData.network_settings.ethernet_state === 'enabled';
    if (!this.wifiEnabled) {
      this.ipv4SettingsCurrent = {
        address: '',
        netmask: '',
        gateway: '',
        dns: '',
      };
    }
    this.allSSID = networkData.network_settings.available_wifi.map(
      (wifi: any) => wifi.ssid,
    );
    this.allWifi = networkData.network_settings.available_wifi.reduce(
      (acc: any, wifi: any) => {
        acc[wifi.ssid] = wifi;
        return acc;
      },
      {},
    );

    this.ethernet.isConnected = false;
    this.allActive = networkData.network_settings.active_connections.reduce(
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
  }

  onChangeSSID(event: any) {
    this.selWifiSecurity = this.allWifi[this.selSSID]['security'];
    this.selWifiSignal = this.allWifi[this.selSSID]['signal'];
    this.selWifiRate = this.allWifi[this.selSSID]['rate'];
  }

  onRescan() {
    this.settingsService.load();
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
      .subscribe({
        next: (response) => {
          this.noteService.handleMessage(response,'Connected successfully!');
          this.settingsService.load();
        },
        error: (response) => {
          this.noteService.handleError(response);
        }
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
      this.settingsService.load();
    });
  }

  onEnableWifi() {
    this.apiService
      .updateSettings({
        network_settings: { wifi_state: 'enabled' },
      })
      .subscribe((resp) => {
        this.settingsService.load();
      });
  }

  onDisableWifi() {
    this.apiService
      .updateSettings({
        network_settings: { wifi_state: 'disabled' },
      })
      .subscribe((resp) => {
        this.settingsService.load();
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
    this.apiService.updateSettings(network_settings).subscribe({
      next: (response) => {
        this.noteService.handleMessage(response,'Settings updated successfully!');
        this.settingsService.load();
      },
      error: (response) => {
        this.noteService.handleError(response);
      }
    });
  }

  onWifiAPSubmit() {
    this.apiService.updateSettings({
      network_settings: {
        ap_state: this.wifiAP.isEnabled ? 'enabled' : 'disabled'
      }
    }).subscribe({
      next: (response) => {
        this.noteService.handleMessage(response,'Settings updated successfully!');
      },
      error: (response) => {
        this.noteService.handleError(response);
      }
    });
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


class WifiAP {
  isEnabled: boolean = false;
}
