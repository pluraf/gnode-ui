import { Component, ViewChildren, ElementRef, QueryList, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { Device } from '../../device/device';
import { Subscription, interval } from 'rxjs';


@Component({
  selector: 'app-device-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './device-dashboard.component.html',
  styleUrl: './device-dashboard.component.css'
})
export class DeviceDashboardComponent {
  apiService = inject(ApiService);
  router = inject(Router);

  @ViewChildren('cnodeFrame') cnodeFrames!: QueryList<ElementRef>;

  deviceList: Device[] = [];

  private cnodeFramesSubscription!: Subscription;
  private updateSubscription!: Subscription;

  constructor() {}

  ngAfterViewInit() {
    this.cnodeFramesSubscription = this.cnodeFrames.changes.subscribe(
      (queryList: QueryList<ElementRef>) => {
        this.updateFrames();
      }
    );
  }

  ngOnInit() {
    this.updateSubscription = interval(1000 * 60 * 10).subscribe(
      () => { this.updateFrames() }
    );
    this.loadDevices();
  }

  ngOnDestroy() {
    this.cnodeFramesSubscription?.unsubscribe();
    this.updateSubscription?.unsubscribe();

    this.cnodeFrames?.forEach((el: ElementRef, index) => {
      if (el.nativeElement.src) {
        URL.revokeObjectURL(el.nativeElement.src);
      }
    });
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
      },
    });
  }

  updateFrames() {
    this.cnodeFrames?.forEach((el: ElementRef, index) => {
      this.apiService.get(
        `api/device/${el.nativeElement.id}/frame?${Date.now()}`,
        { responseType: 'blob' }
      ).subscribe({
        next: (blob: Blob) => {
          if (el.nativeElement.src) {
            URL.revokeObjectURL(el.nativeElement.src);
          }
          el.nativeElement.src = URL.createObjectURL(blob);
        },
      });
    });
  }

  navigateToDevice(deviceId: String) {
    this.router.navigateByUrl("/device/" + deviceId);
  }

}
