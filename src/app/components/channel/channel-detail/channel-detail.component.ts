import { Component, Inject, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

import { ApiService } from '../../../services/api.service';
import { SettingsService } from '../../../services/settings.service';
import { InfoService } from '../../../services/info.service';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { DeleteComponent } from '../../shared/delete/delete.component';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [
    CommonModule,
    SubheaderComponent,
    TableModule,
    CardModule,
    RouterModule,
    DeleteComponent,
  ],
  templateUrl: './channel-detail.component.html',
  styleUrl: './channel-detail.component.css',
})
export class ChannelDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  apiService = inject(ApiService);
  settingsService = inject(SettingsService);
  infoService = inject(InfoService);
  router = inject(Router);
  chanid = '';
  details: any;
  connDetails: string[][] = [];
  visibleDialog: boolean = false;
  menubarItems: MenuItem[] = [];
  selectedChannel: any = { id: this.chanid };

  exampleHost = '';
  channel: any = {
    username: '',
  };

  constructor() {
    this.chanid = this.route.snapshot.params['chanid'];
    this.menubarItems = [
      {
        routerLink: ['/channels/channel-edit', this.chanid],
        tooltipOptions: {
          tooltipEvent: 'hover',
          tooltipPosition: 'bottom',
          tooltipLabel: 'Edit channel',
        },
        iconClass: 'pi pi-pencil m-1',
      },
      {
        tooltipOptions: {
          tooltipEvent: 'hover',
          tooltipPosition: 'bottom',
          tooltipLabel: 'Delete channel',
        },
        iconClass: 'pi pi-trash m-1',
        command: () => {
          this.showDialog();
        },
      },
    ];

    this.apiService.channelGet(this.chanid).subscribe((response: any) => {
      this.channel = response;
      const timestamp = this.channel.msg_timestamp;
      let recivedTimestamp = '-';
      if (timestamp != 0) {
        const iso8601 = new Date(timestamp * 1000);
        recivedTimestamp = iso8601
          .toString()
          .slice(0, iso8601.toString().indexOf('GMT'));
      }

      this.details = [
        ['State', this.channel.disabled ? 'Disabled' : 'Enabled'],
        ['Authentication type', this.channel.authtype],
        ['Username', this.channel.username],
        ['MQTT Client ID', this.channel.clientid],
        ['Messages received', this.channel.msg_received],
        ['Last message timestamp', recivedTimestamp],
      ];
    });

    effect(() => {
      const gnode_hostname = `gnode-${this.infoService.infoData().serial_number}`;
      const settings = this.settingsService.settingsdata();
      const network_settings = settings.network_settings;

      this.connDetails = [
        ['TCP Port', '1883', 'No encryption'],
        ['TLS TCP Port', '8883', 'Encrypted'],
        ['Host name', `${gnode_hostname}.local`, 'Local Network'],
      ];

      if (network_settings) {
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

      this.connDetails.push([
        'G-Cloud Host',
        `${gnode_hostname}.iotplan.io`,
        settings.gcloud.https || settings.gcloud.ssh ? 'Enabled' : 'Disabled',
      ]);
    });
  }

  showDialog() {
    this.visibleDialog = true;
  }

  onDeleteChannel() {
    this.apiService.channelDelete(this.chanid).subscribe({
      next: (response: any) => {
        if (response.success || response.status === 'success') {
          this.details = [];
          this.channel = null;
        }
        this.visibleDialog = false;
        this.router.navigateByUrl('/channels');
      },
    });
  }
}
