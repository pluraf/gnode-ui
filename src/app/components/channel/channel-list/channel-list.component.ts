import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { catchError, forkJoin, Observable, of } from 'rxjs';
import { DateTime } from 'luxon';

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
import { DatetimeService } from '../../../services/datetime.service';
import { DeleteComponent } from '../../shared/delete/delete.component';
import {
  ITableColumn,
  SupremeTableComponent,
} from '../../shared/supreme-table/supreme-table.component';

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SubheaderComponent,
    DialogModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    FontAwesomeModule,
    DeleteComponent,
    SupremeTableComponent,
  ],
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

  columnList: ITableColumn[] = [
    {
      fieldName: 'id',
      headerName: 'Channel ID',
      routePage: (row: any) => `/channels/channel/${row.id}`,
    },
    {
      fieldName: 'type',
      headerName: 'Type',
    },
    {
      fieldName: 'lastseen',
      headerName: 'Last Seen',
    },
    {
      fieldName: 'state',
      headerName: 'State',
      enabled: true,
    },
  ];

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
  datetimeService = inject(DatetimeService);

  constructor() {}

  ngOnInit() {
    this.loadChannels();
  }

  loadChannels() {
    this.apiService.channelList().subscribe({
      next: (response: any) => {
        const clientResponse = response;
        const channels = clientResponse;
        this.channelList = channels.map((channel: any) => {
          let obj = { id: '', lastseen: '', enabled: false, type: '' };
          if (channel.msg_timestamp === undefined) {
            obj.lastseen = '-';
          } else if (channel.msg_timestamp === 0) {
            obj.lastseen = 'never';
          } else {
            obj.lastseen = DateTime.fromJSDate(
              new Date(channel.msg_timestamp * 1000),
              {
                zone: this.datetimeService.timezone,
              },
            ).toFormat('yyyy-MM-dd HH:mm');
          }

          // Need to modify the obj key-value naming convention as per latest backend code
          obj.id = channel.id;
          obj.type = channel.type;
          obj.enabled = channel.disabled;

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
      this.noteService.handleWarning(
        this.messageService,
        'No channels selected.',
      );
    } else {
      this.visibleDialog = true;
    }
  }

  onDeleteChannel() {
    let observables: Observable<any>[] = [];
    this.selectedChannels.map((channel) => {
      observables.push(
        this.apiService
          .channelDelete(channel.id)
          .pipe(catchError((err) => {
            this.noteService.handleError(err);
            return of(true);
          }))
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

  onSelectionChange(selectedItems: any) {
    console.log('Selected Items:', selectedItems);
  }

  routePage(column: ITableColumn) {}
}
