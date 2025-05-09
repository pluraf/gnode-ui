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
  templateUrl: './channel-detail.component.html',
  styleUrl: './channel-detail.component.css',
})
export class ChannelDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  apiService = inject(ApiService);
  settingsService = inject(SettingsService);
  infoService = inject(InfoService);
  noteService = inject(NoteService);
  router = inject(Router);
  chanid = '';
  details: any;
  virtual = false;
  connDetails: string[][] = [];
  visibleDialog: boolean = false;
  menubarItems: MenuItem[] = [];
  selectedChannel: any = { id: this.chanid };

  exampleHost = '';
  channel: any = {};

  constructor() {
    this.chanid = this.route.snapshot.params['chanid'];
    this.menubarItems = [
      {
        id: "edit",
        routerLink: ['/channels/channel-edit', this.chanid],
        tooltipOptions: {
          tooltipEvent: 'hover',
          tooltipPosition: 'bottom',
          tooltipLabel: 'Edit channel',
        },
        iconClass: 'pi pi-pencil m-1',
      },
      {
        id: "delete",
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

    this.virtual = this.infoService.infoData().mode === "virtual";

    this.apiService.channelGet(this.chanid).subscribe((response: any) => {
      this.channel = response;
      this.details = this.getDetails();
      this.connDetails = this.getConnDetails(
        this.infoService.infoData().hostname,
        this.settingsService.settingsdata().network_settings
      );
      if (this.channel.type === 'lora') {
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
    let recivedTimestamp = '-';
    if (this.channel.msg_timestamp != 0) {
      const iso8601 = new Date(this.channel.msg_timestamp * 1000);
      recivedTimestamp = iso8601
        .toString()
        .slice(0, iso8601.toString().indexOf('GMT'));
    }
    let details: string[][] = [
      ['Channel ID', this.chanid],
      ['State', this.channel.state],
      ['Enabled', this.channel.enabled],
      ['Type', this.channel.type],
      ['Authentication type', this.channel.authtype],
    ];
    if (this.channel.type == "mqtt") {
      details.push(['Username', this.channel.username]);
      details.push(['MQTT Client ID', this.channel.clientid]);
      details.push(['Messages received', this.channel.msg_received]);
      details.push(['Last message timestamp', recivedTimestamp]);
    } else if (this.channel.type == "http") {
      details.push(['Path', this.channel.path]);
      details.push(['Queue', this.channel.queue_name]);
      details.push(['Messages received', this.channel.msg_received]);
      details.push(['Last message timestamp', recivedTimestamp]);
    }
    return details;
  }

  getConnDetails(gnode_hostname: any, network_settings: any): string[][] {
    let details: string[][] = [];
    if (this.channel?.ports) {
      this.channel.ports.forEach((p:any) => {
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

  onDeleteChannel() {
    this.apiService.channelDelete(this.chanid).subscribe({
      next: (response: any) => {
        if (response.ok) {
          this.noteService.handleInfo('Channel deleted successfully!');
          this.router.navigateByUrl('/channels');
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
