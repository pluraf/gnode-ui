import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { catchError, forkJoin, Observable, of } from 'rxjs';
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
import { ApiService } from '../../../services/api.service';
import { NoteService } from '../../../services/note.service';
import { SettingsService } from '../../../services/settings.service';
import { DeleteComponent } from '../../shared/delete/delete.component';

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
    DialogModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    FontAwesomeModule,
    DeleteComponent,
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

  apiService = inject(ApiService);
  messageService = inject(MessageService);
  noteService = inject(NoteService);
  settingsService = inject(SettingsService);

  constructor() {}

  ngOnInit() {
    this.loadChannels();
  }

  loadChannels() {
    this.showLoading = true;
    this.apiService.channelList().subscribe({
      next: (response: any) => {
        this.showLoading = false;
        const clientResponse = response;
        const channels = clientResponse;
        this.channelList = channels.map((channel: any) => {
          let obj = { id: '', lastseen: '', communication: false };
          if (channel.msg_received === 0) {
            obj.lastseen = 'never';
          } else {
            obj.lastseen = DateTime.fromJSDate(new Date(channel.msg_received), {
              zone: this.settingsService.settingsdata().time.timezone,
            }).toFormat('yyyy-MM-dd HH:mm');
          }
          obj.id = channel.chanid;
          obj.communication = !channel.disabled;
          return obj;
        });
        this.totalRecords = this.channelList.length;
        if (this.totalRecords === 0) {
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
    let observables: Observable<any>[] = [];
    this.selectedChannels.map((channel) => {
      observables.push(
        this.apiService
          .channelDelete(channel.id)
          .pipe(catchError((err) => of(true))),
      );
    });

    forkJoin(observables).subscribe({
      next: (response: any) => {
        this.visibleDialog = false;
        this.selectedChannels = [];
        this.loadChannels();
      },
      error: (response: any) => {
        this.visibleDialog = false;
        this.selectedChannels = [];
        this.loadChannels();
      },
    });
  }
}
