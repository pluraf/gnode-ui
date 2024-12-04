import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DateTime } from 'luxon';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Channel } from '../channel';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { MBrokerCService } from '../../../services/mbrokerc.service';
import { ChannelDeleteComponent } from '../channel-delete/channel-delete.component';
import { NoteService } from '../../../services/note.service';
import { SettingsService } from '../../../services/settings.service';

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
    FontAwesomeModule,
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
  settingsService = inject(SettingsService);

  constructor() {}

  ngOnInit() {
    this.loadChannels();
  }

  loadChannels() {
    this.showLoading = true;
    this.brokerService.loadChannelList().subscribe({
      next: (response: { responses: any[] }) => {
        this.showLoading = false;
        const clientResponse = response.responses.find(
          (r: { command: string }) => r.command === 'listChannels',
        );

        if (clientResponse) {
          const clientData = clientResponse.data;
          if (clientData?.channels) {
            this.channelList = clientData.channels.map((channel : any) => {
              let obj = {id: "", lastseen: "", communication: false};
              if (channel.msg_received === 0) {
                obj.lastseen = "never";
              } else {
                obj.lastseen = DateTime.fromJSDate(
                  new Date(channel.msg_received),
                  {zone: this.settingsService.settingsdata().time.timezone}
                )
                .toFormat('yyyy-MM-dd HH:mm');
              }
              obj.id = channel.chanid;
              obj.communication = !channel.disabled;
              return obj;
            });
          };
          this.totalRecords = this.channelList.length;
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
