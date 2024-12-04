import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, map } from 'rxjs';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { Channel } from '../channel';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { MBrokerCService } from '../../../services/mbrokerc.service';
import { ChannelDeleteComponent } from '../channel-delete/channel-delete.component';
import { NoteService } from '../../../services/note.service';

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
    ToastModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService, NoteService],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.css',
})
export class ChannelListComponent {
  visibleDialog: boolean = false;
  channelList: Channel[] = [];
  selectedChannels: Channel[] = [];
  showMessage: boolean = false;
  totalRecords!: number;
  chanid: string = '';
  showLoading: boolean = false;

  changeDetector = inject(ChangeDetectorRef);

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
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  constructor() {}

  ngOnInit() {
    this.loadChannels();
  }

  loadChannels() {
    this.showLoading = true;
    this.brokerService.loadChannelList().subscribe({
      next: (response: { responses: any[] }) => {
        const clientResponse = response.responses.find(
          (r: { command: string }) => r.command === 'listChannels',
        );

        if (clientResponse) {
          const clientData = clientResponse.data;

          if (clientData?.channels) {
            this.channelList = clientData.channels.map((chanid: string) => ({
              id: chanid,
              communication: '',
              lastseen: '',
            }));
            this.totalRecords = this.channelList.length;

            // Creating an array of observables for channel details
            const channelDetailsObservables = this.channelList.map((channel) =>
              this.brokerService.loadChannelDetails(channel.id).pipe(
                map((response: any) => {
                  const channelData = response.responses[0]?.data?.channel;
                  const timestamp = channelData.msg_timestamp;
                  let lastseen = '-';
                  if (timestamp != 0) {
                    const iso8601 = new Date(timestamp * 1000);
                    lastseen = iso8601
                      .toString()
                      .slice(0, iso8601.toString().indexOf('GMT'));
                  }
                  channel.lastseen = lastseen;
                  channel.communication = channelData.disabled
                    ? 'Allowed'
                    : 'Blocked';
                  return channel;
                }),
              ),
            );

            // Using forkJoin to wait for all channel details to load concurrently
            forkJoin(channelDetailsObservables).subscribe({
              next: (updatedChannels) => {
                this.channelList = updatedChannels;
                this.showLoading = false;
              },
              error: (err) => {
                console.error('Error loading channel details:', err);
                this.showLoading = false;
              },
            });
          }
        }
        if (clientResponse.data.totalCount === 0) {
          this.showMessage = true;
        }
      },
    });
  }

  showDialog() {
    if (this.selectedChannels.length === 0) {
      this.noteService.handleMessage(
        this.messageService,
        'warn',
        'No channels selected.',
      );
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
          const deletedChannels = deleteResponse.deleted;
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
