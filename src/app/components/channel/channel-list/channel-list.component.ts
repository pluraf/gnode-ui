import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { Channel, PageEvent } from '../channel';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { MBrokerCService } from '../../../services/mbrokerc.service';
import { ChannelDeleteComponent } from '../channel-delete/channel-delete.component';

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SubheaderComponent,
    TableModule,
    PaginatorModule,
    ChannelDeleteComponent,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.css',
})
export class ChannelListComponent {
  value!: string;
  visibleDialog: boolean = false;
  channelList: Channel[] = [];
  selectedChannels: Channel[] = [];
  showMessage: boolean = false;

  totalRecords!: number;

  menubarItems: MenuItem[] = [
    {
      routerLink: '/channels/channel-create',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create channel',
      },
      iconClass: 'pi pi-plus m-1',
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

  brokerService = inject(MBrokerCService);

  constructor() {
    this.loadChannels();
  }

  loadChannels() {
    this.brokerService.loadChannelList().subscribe({
      next: (response: { responses: any[] }) => {
        const clientResponse = response.responses.find(
          (r: { command: string }) => r.command === 'listChannels',
        );

        if (clientResponse) {
          const clientData = clientResponse.data;
          const disabled = clientResponse.verbose;

          if (clientData?.channels) {
            this.channelList = clientData.channels.map((channid: string) => ({
              id: channid,
              communication: disabled ? 'Blocked' : 'Allowed',
              lastseen: this.formatDate(new Date()),
            }));
            this.totalRecords = this.channelList.length;
          }
        }
        if (clientResponse.length === 0) {
          this.showMessage = !this.showMessage;
        }
      },
    });
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-EU', options);
  }

  showDialog() {
    if (this.selectedChannels.length === 0) {
      alert('No channels selected');
      return;
    }
    this.visibleDialog = true;
  }

  onDeleteChannel() {
    const channelId = this.selectedChannels.map((channel) => channel.id);
    this.brokerService.deleteChannels(channelId).subscribe({
      next: (response: { responses: any[] }) => {
        const deleteResponse = response.responses.find(
          (r: { command: string }) => r.command === 'deleteChannels',
        );

        if (deleteResponse) {
          const deletedChannels = deleteResponse.deleted || [];
          this.channelList = this.channelList.filter(
            (channel) => !deletedChannels.includes(channel.id),
          );
          this.totalRecords = this.channelList.length;
        }

        this.visibleDialog = false;
      },
    });
  }
}
