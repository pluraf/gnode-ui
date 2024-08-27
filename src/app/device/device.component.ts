import { Component } from '@angular/core';

import {
  FormsModule,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PRIMENG_MODULES } from '../shared/primeng-modules';
import { Device, Sidemenu, PageEvent } from './device';
import { Router, RouterModule } from '@angular/router';
import { DevicesCreateComponent } from './devices-create/devices-create.component';
import { DevicesEditComponent } from './devices-edit/devices-edit.component';
import { StatusComponent } from '../components/sidemenu/status/status.component';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PRIMENG_MODULES,
    RouterModule,
    DevicesCreateComponent,
    DevicesEditComponent,
    StatusComponent,
  ],
  templateUrl: './device.component.html',
  styleUrl: './device.component.css',
})
export class DeviceComponent {
  value!: string;
  hideDevices: boolean = true;
  hideStatus: boolean = true;

  formGroup!: FormGroup<{ selectedMenu: FormControl<Sidemenu | null> }>;

  sidemenulist: Sidemenu[] = [{ name: 'Devices' }, { name: 'Status' }];
  first: number = 0;
  rows: number = 5;
  totalRecords: number = 5;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  deviceList: Device[] = [
    {
      id: 1,
      deviceID: 'Device-1',
      communication: 'Allowed',
      lastseen: this.formatDate(new Date()),
    },
    {
      id: 2,
      deviceID: 'Device-2',
      communication: 'Allowed',
      lastseen: this.formatDate(new Date()),
    },
    {
      id: 3,
      deviceID: 'Device-3',
      communication: 'Allowed',
      lastseen: this.formatDate(new Date()),
    },
    {
      id: 4,
      deviceID: 'Device-4',
      communication: 'Allowed',
      lastseen: this.formatDate(new Date()),
    },
  ];

  onPageChange(event: PageEvent) {
    this.first = event!.first;
    this.rows = event!.rows;
  }
  displayDialog: boolean = false;
  newDevice: boolean = false;
  device: Device = { deviceID: '', communication: '', lastseen: '' };
  selectedDevice!: Device;
  selectedMenuName: string = 'Devices';

  constructor(private router: Router) {
    this.formGroup = new FormGroup({
      selectedMenu: new FormControl<Sidemenu | null>(null),
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

  showDialogToAdd() {
    this.hideDevices = false;
  }

  delete() {
    this.deviceList = this.deviceList.filter(
      (dev) => dev !== this.selectedDevice,
    );
    this.device = { deviceID: '', communication: '', lastseen: '' };
    this.displayDialog = false;
  }

  onRowSelect(event: any) {
    this.router.navigateByUrl('/device-detail');
  }
  onMenuSelect(event: any) {
    const selectedItem = event.value;
    if (selectedItem) {
      this.selectedMenuName = selectedItem.name;
      if (this.selectedMenuName === 'Status') {
        this.hideStatus = false; /* 
        this.router.navigateByUrl('/status'); */
      }
    }
  }
}
