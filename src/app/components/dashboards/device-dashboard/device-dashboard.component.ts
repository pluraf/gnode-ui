import { Component, ViewChild, ViewChildren, ElementRef, QueryList, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Subscription, interval } from 'rxjs';

import { decode as cbor_decode } from 'cbor2';

import { ApiService } from '../../../services/api.service';
import { Device } from '../../device/device';



@Component({
  selector: 'app-device-dashboard',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './device-dashboard.component.html',
  styleUrl: './device-dashboard.component.css'
})
export class DeviceDashboardComponent {
  apiService = inject(ApiService);
  router = inject(Router);

  @ViewChildren('cnodeFrame') cnodeFrames!: QueryList<ElementRef>;
  @ViewChild('cnodeFrameBig') cnodeFrameBig!: ElementRef;

  deviceList: Device[] = [];
  deviceData: Record<string, Array<Record<string, any>>> = {
    "1": [{"title": "Temp", "value": 20, "units": "C"}, {"title": "Battery", "value": 60, "units": "%"}],
    "2": [{"title": "Temp", "value": 30, "units": "C"}, {"title": "Battery", "value": 90, "units": "%"}]
  };
  isOpen: boolean = false;

  private cnodeFramesSubscription!: Subscription;
  private updateSubscription!: Subscription;

  constructor() {}

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.hideBig(event);
  }

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
        `api/device/${el.nativeElement.getAttribute("device-id")}/frame/latest`,
        {
          params: { "preview": true, "timestamp": `${Date.now()}` },
          responseType: 'arraybuffer'
        }
      ).subscribe({
        next: (arrayBuffer: ArrayBuffer) => {
          const device_id = el.nativeElement.getAttribute("device-id");
          this.deviceData[device_id] = [];
          const cbor_encoded = new Uint8Array(arrayBuffer);
          const decoded = cbor_decode(cbor_encoded);

          console.log(decoded);
          for (const [key, value] of Object.entries(decoded as Object)) {
            if (key == "frame_id")
            {
              el.nativeElement.setAttribute("frame-id", value);
            }
            else if (key == "data_frame")
            {
              const blob = new Blob([value], { type: 'image/jpeg' });
              if (el.nativeElement.src) {
                URL.revokeObjectURL(el.nativeElement.src);
              }
              el.nativeElement.src = URL.createObjectURL(blob);
            }
            else if (key == "sensor_data")
            {
              for ( const sensor of value ) {
                this.deviceData[device_id].push(sensor)
              };
            }
          }
        },
      });
    });
  }

  showBig(event: Event) {
    this.apiService.get(
      `api/device/${(event.target as HTMLElement).getAttribute("device-id")}/frame/${(event.target as HTMLElement).getAttribute("frame-id")}`,
      {
        params: { "preview": false, "timestamp": `${Date.now()}` },
        responseType: 'arraybuffer'
      }
    ).subscribe({
      next: (arrayBuffer: ArrayBuffer) => {
        const cbor_encoded = new Uint8Array(arrayBuffer);
        const decoded = cbor_decode(cbor_encoded);
        const blob = new Blob([(decoded as any).data_frame], { type: 'image/jpeg' });
        if (this.cnodeFrameBig.nativeElement.src) {
          URL.revokeObjectURL(this.cnodeFrameBig.nativeElement.src);
        }
        this.cnodeFrameBig.nativeElement.src = URL.createObjectURL(blob);
      },
    });
    this.isOpen = true;
  }

  hideBig(event: Event) {
    if (this.cnodeFrameBig.nativeElement.src) {
      URL.revokeObjectURL(this.cnodeFrameBig.nativeElement.src);
    }

    this.isOpen = false;
  }

  navigateToDevice(deviceId: String) {
    this.router.navigateByUrl("/device/" + deviceId);
  }

}
