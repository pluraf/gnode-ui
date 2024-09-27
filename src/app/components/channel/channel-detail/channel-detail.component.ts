import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { MBrokerCService } from '../../../services/mbrokerc.service';
import { ChannelDeleteComponent } from '../channel-delete/channel-delete.component';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [
    CommonModule,
    SubheaderComponent,
    TableModule,
    RouterModule,
    ChannelDeleteComponent,
  ],
  templateUrl: './channel-detail.component.html',
  styleUrl: './channel-detail.component.css',
})
export class ChannelDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  brokerService = inject(MBrokerCService);
  router = inject(Router);
  chanid = '';
  channel: any;
  details: any;
  visibleDialog: boolean = false;
  menubarItems: MenuItem[] = [];

  constructor() {
    this.chanid = this.route.snapshot.params['chanid'];
    this.menubarItems = [
      {
        routerLink: ['/channel-edit', this.chanid],
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

    this.brokerService
      .loadChannelDetails(this.chanid)
      .subscribe((response: any) => {
        this.channel = response.responses[0].data.channel;
        this.details = [
          ['Enabled', !this.channel.disabled],
          ['Last seen', 'date'],
          ['Authentication type', this.channel.authtype],
          ['Username', this.channel.username],
          ['MQTT Client ID', this.channel.clientid],
        ];
        if (this.channel.authtype && this.channel.authtype.startsWith('jwt')) {
          this.details.push([
            'JWT key',
            this.channel.jwtkey.replace(/(.{64})/g, '$1\n'),
          ]);
        }
        /*   if (this.channel.authtype && this.channel.authtype.startsWith('jwt')) { 
            if (this.channel.jwtkey) {
              const formattedJwtKey = this.channel.jwtkey.replace(/(.{64})/g, '$1\n');
              this.details.push(['JWT key', formattedJwtKey]);
            }
          } */
      });
  }

  showDialog() {
    this.visibleDialog = true;
  }

  onDeleteChannel() {
    this.brokerService.deleteChannels([this.chanid]).subscribe({
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
