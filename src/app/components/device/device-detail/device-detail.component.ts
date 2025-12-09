import { Component, Inject, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

import { ApiService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { InfoService } from '../../../services/info.service';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { DeleteComponent } from '../../shared/delete/delete.component';
import { NoteService } from '../../../services/note.service';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [
    CommonModule,
    SubheaderComponent,
    TableModule,
    CardModule,
    RouterModule,
    ToastModule,
    DeleteComponent,
  ],
  templateUrl: './device-detail.component.html',
  styleUrl: './device-detail.component.css',
})
export class DeviceDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  apiService = inject(ApiService);
  settingsService = inject(SettingsService);
  infoService = inject(InfoService);
  noteService = inject(NoteService);
  router = inject(Router);
  devid = '';
  details: any;
  virtual = false;
  connDetails: string[][] = [];
  visibleDialog: boolean = false;
  menubarItems: MenuItem[] = [];
  selectedDevice: any = { id: this.devid };

  exampleHost = '';
  device: any = {};

  constructor() {
    this.devid = this.route.snapshot.params['devid'];
    this.menubarItems = [
      {
        id: "edit",
        routerLink: ['/devices/device-edit', this.devid],
        tooltipOptions: {
          tooltipEvent: 'hover',
          tooltipPosition: 'bottom',
          tooltipLabel: 'Edit device',
        },
        iconClass: 'pi pi-pencil m-1',
      },
      {
        id: "delete",
        tooltipOptions: {
          tooltipEvent: 'hover',
          tooltipPosition: 'bottom',
          tooltipLabel: 'Delete device',
        },
        iconClass: 'pi pi-trash m-1',
        command: () => {
          this.showDialog();
        },
      },
    ];

    this.virtual = this.infoService.infoData().mode === "virtual";

    this.apiService.deviceGet(this.devid).subscribe((response: any) => {
      this.device = response;
      this.details = this.getDetails();
      this.connDetails = this.getConnDetails(
        this.infoService.infoData().hostname,
        this.settingsService.settingsdata().network_settings
      );
      if (this.device.type === 'lora') {
        this.menubarItems.forEach(i => {if (i.id !== 'edit') i.disabled = true;})
      }
    });

    effect(() => {
      const gnode_hostname = this.infoService.infoData().hostname;
      const settings = this.settingsService.settingsdata();
      const network_settings = settings.network_settings;

      this.connDetails = this.getConnDetails(gnode_hostname, network_settings);

      if (!this.virtual) {
        this.connDetails.push([
          'G-Cloud Host',
          `${gnode_hostname}.iotplan.io`,
          settings.gcloud.https || settings.gcloud.ssh ? 'Enabled' : 'Disabled',
        ]);
      }
    });
  }

  getDetails(): any {
    let details: string[][] = [
      ['Device ID', this.devid],
      ['Type', this.device.type],
      ['Enabled', this.device.enabled],
      ['Description', this.device.description],
    ];

    return details;
  }

  getConnDetails(gnode_hostname: any, network_settings: any): string[][] {
    let details: string[][] = [];
    if (this.device?.ports) {
      this.device.ports.forEach((p:any) => {
        details.push([p.descr, p.port, ""]);
      });
    }

    if (this.virtual) {
      details.push(['Host name', `127.0.0.1`, 'Local Network']);
    } else {
      details.push(['Host name', `${gnode_hostname}.local`, 'Local Network']);
    }
    if (!this.virtual) {
      if (network_settings && network_settings.hasOwnProperty("active_connections")) {
        for (const conn of network_settings.active_connections) {
          if (conn.type == 'wifi') {
            this.connDetails.push([
              'Host IP',
              conn.ipv4_settings.address,
              'WiFi',
            ]);
            this.exampleHost = conn.ipv4_settings.address;
          } else if (conn.type == 'ethernet') {
            this.connDetails.push([
              'Host IP',
              conn.ipv4_settings.address,
              'Ethernet',
            ]);
            this.exampleHost = conn.ipv4_settings.address;
          }
        }
      }
    } else {
      this.exampleHost = "127.0.0.1"
    }
    return details;
  }

  showDialog() {
    this.visibleDialog = true;
  }

  onDeleteDevice() {
    this.apiService.deviceDelete(this.devid).subscribe({
      next: (response: any) => {
        if (response.ok) {
          this.noteService.handleInfo('Device deleted successfully!');
          this.router.navigateByUrl('/devices');
        }
        this.visibleDialog = false;
      },
      error: (response: any) => {
        this.noteService.handleError(response);
        this.visibleDialog = false;
      }
    });
  }
}
