import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { catchError, forkJoin, Observable, of } from 'rxjs';

import { MenuItem, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Device } from '../device';
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
  selector: 'app-device-list',
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
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.css',
})
export class DeviceListComponent {
  visibleDialog: boolean = false;
  deviceList: Device[] = [];
  selectedDevices: Device[] = [];
  showMessage: boolean = false;
  totalRecords!: number;
  devid: string = '';

  columnList: ITableColumn[] = [
    {
      fieldName: 'id',
      headerName: 'Device ID',
      routePage: (row: any) => `/devices/device/${row.id}`,
    },
    {
      fieldName: 'type',
      headerName: 'Type',
    },
    {
      fieldName: 'enabled',
      headerName: 'State',
      pictogram: true,
    },
    {
      fieldName: 'description',
      headerName: 'Description',
    },
  ];

  menubarItems: MenuItem[] = [
    {
      routerLink: '/devices/device-create',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create device',
      },
      iconClass: 'pi pi-plus m-1',
    },
    {
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

  apiService = inject(ApiService);
  messageService = inject(MessageService);
  noteService = inject(NoteService);
  datetimeService = inject(DatetimeService);

  constructor() {}

  ngOnInit() {
    this.loadDevices();
  }

  loadDevices() {
    this.apiService.deviceList().subscribe({
      next: (response: any) => {
        const clientResponse = response;
        const devices = clientResponse;
        this.deviceList = devices.map((device: any) => {
          let obj = { id: '', lastseen: '', enabled: false, type: '', description: '' };
          obj.id = device.id;
          obj.type = device.type;
          obj.description = device.description;
          obj.enabled = device.enabled;
          return obj;
        });
        this.totalRecords = this.deviceList.length;
        if (this.totalRecords === 0) {
          this.showMessage = true;
        }
      },
    });
  }

  showDialog() {
    if (this.selectedDevices.length === 0) {
      this.noteService.handleWarning(
        this.messageService,
        'No devices selected.',
      );
    } else {
      this.visibleDialog = true;
    }
  }

  onDeleteDevice() {
    let observables: Observable<any>[] = [];
    this.selectedDevices.map((device) => {
      observables.push(
        this.apiService
          .deviceDelete(device.id)
          .pipe(catchError((err) => {
            this.noteService.handleError(err);
            return of(true);
          }))
      );
    });

    forkJoin(observables).subscribe({
      next: (response: any) => {
        this.visibleDialog = false;
        this.selectedDevices = [];
        this.loadDevices();
      },
      error: (response: any) => {
        this.visibleDialog = false;
        this.selectedDevices = [];
        this.loadDevices();
      },
    });
  }

  onSelectionChange(selectedItems: any) {
    console.log('Selected Items:', selectedItems);
  }

  routePage(column: ITableColumn) {}
}
