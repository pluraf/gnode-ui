import { Component } from '@angular/core';
import { Device } from '../device';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-detail.component.html',
  styleUrl: './device-detail.component.css',
})
export class DeviceDetailComponent {
  deviceList: Device[] = [
    {
      id: 1,
      deviceID: 'Device-1',
      communication: 'Allowed',
    },
    {
      id: 2,
      deviceID: 'Device-2',
      communication: 'Allowed',
    },
    {
      id: 3,
      deviceID: 'Device-3',
      communication: 'Allowed',
    },
    {
      id: 4,
      deviceID: 'Device-4',
      communication: 'Allowed',
    },
  ];
}
