import { Component } from '@angular/core';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { Device, Sidemenu, PageEvent } from './device';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ListboxModule } from 'primeng/listbox';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SplitterModule, TableModule, PanelModule, CheckboxModule, RadioButtonModule, InputTextModule, ListboxModule, DialogModule, ButtonModule, PaginatorModule, DividerModule],
  templateUrl: './device.component.html',
  styleUrl: './device.component.css',
})
export class DeviceComponent {
  value!: string;
  formGroup!: FormGroup<{ selectedMenu: FormControl<Sidemenu | null> }>;

  sidemenulist: Sidemenu[] = [
    { name: 'Devices' },
    { name: 'Status' },

  ];
  first: number = 0;
  rows: number = 5;
  totalRecords: number = 5;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  deviceList: Device[] = [
    { id: 1, deviceID: 'Device-1', communication: 'Allowed', lastseen: this.formatDate(new Date()) },
    { id: 2, deviceID: 'Device-2', communication: 'Allowed', lastseen: this.formatDate(new Date()) },
    { id: 3, deviceID: 'Device-3', communication: 'Allowed', lastseen: this.formatDate(new Date()) },
    { id: 4, deviceID: 'Device-4', communication: 'Allowed', lastseen: this.formatDate(new Date()) }
  ];

  onPageChange(event: PageEvent) {
    this.first = event!.first;
    this.rows = event!.rows;
  }
  displayDialog: boolean = false;
  newDevice: boolean = false;
  device: Device = { deviceID: '', communication: '', lastseen: '', };
  selectedDevice!: Device;
  selectedMenuName: string = 'Devices';


  constructor() {
    this.formGroup = new FormGroup({
      selectedMenu: new FormControl<Sidemenu | null>(null)
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
      hour12: true
    };
    return date.toLocaleString('en-EU', options);
  }

  showDialogToAdd() {
    this.newDevice = true;
    this.device = { deviceID: '', communication: '', lastseen: this.formatDate(new Date()) };
    this.displayDialog = true;
  }

  save() {
    let deviceList = [...this.deviceList];
    if (this.newDevice) {
      this.device.id = this.deviceList.length + 1;
      deviceList.push(this.device);
    } else {
      deviceList[this.deviceList.indexOf(this.selectedDevice)] = this.device;
    }

    this.deviceList = deviceList;
    this.device = { deviceID: '', communication: '', lastseen: '' };
    this.displayDialog = false;
  }

  delete() {
    this.deviceList = this.deviceList.filter(dev => dev !== this.selectedDevice);
    this.device = { deviceID: '', communication: '', lastseen: '' };
    this.displayDialog = false;
  }

  onRowSelect(event: any) {
    this.newDevice = false;
    this.device = { ...event.data };
    this.displayDialog = true;
  }
  onMenuSelect(event: any) {
    const selectedItem = event.value;
    if (selectedItem) {
      this.selectedMenuName = selectedItem.name;
    }
  }

}
