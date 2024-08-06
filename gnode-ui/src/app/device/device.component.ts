import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { Device, Sidemenu } from './device';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule, SplitterModule, TableModule, PanelModule, CheckboxModule, RadioButtonModule, InputTextModule, ListboxModule, DialogModule, ButtonModule, DividerModule],
  templateUrl: './device.component.html',
  styleUrl: './device.component.css',
})
export class DeviceComponent {
  value!: string;
  formGroup!: FormGroup<{ selectedMenu: FormControl<Sidemenu | null> }>;

  sidemenulist: Sidemenu[] = [
    { name: 'Registry Details' },
    { name: 'Devices' },
    { name: 'Gateways' },
    { name: 'Monitoring' },
  ];

  deviceList: Device[] = [
    { id: 1, deviceID: 'sdfdgfh', communication: 'Allowed', lastseen: this.formatDate(new Date()), cloudlogging: 'System default' },
    { id: 2, deviceID: 'abcd', communication: 'Allowed', lastseen: this.formatDate(new Date()), cloudlogging: 'System default' },
    { id: 3, deviceID: 'efgh', communication: 'Allowed', lastseen: this.formatDate(new Date()), cloudlogging: 'System default' },
    { id: 4, deviceID: 'ijkl', communication: 'Allowed', lastseen: this.formatDate(new Date()), cloudlogging: 'System default' }
  ];

  displayDialog: boolean = false;
  newDevice: boolean = false;
  device: Device = { deviceID: '', communication: '', lastseen: '', cloudlogging: '' };
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
 /*  @ViewChild('filterContainer') filterContainer!: ElementRef<HTMLDivElement>;
  focusDiv(event: Event): void {
    event.preventDefault();
    this.filterContainer.nativeElement.focus();
    this.filterContainer.nativeElement.style.boxShadow = '0 0 5px rgba(81, 203, 238, 1)';
    this.filterContainer.nativeElement.style.border = '1px solid rgba(81, 203, 238, 1)';
    } */

  showDialogToAdd() {
    this.newDevice = true;
    this.device = { deviceID: '', communication: '', lastseen: this.formatDate(new Date()), cloudlogging: '' };
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
    this.device = { deviceID: '', communication: '', lastseen: '', cloudlogging: '' };
    this.displayDialog = false;
  }

  delete() {
    this.deviceList = this.deviceList.filter(dev => dev !== this.selectedDevice);
    this.device = { deviceID: '', communication: '', lastseen: '', cloudlogging: '' };
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
