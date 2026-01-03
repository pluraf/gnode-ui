import { Component, ViewChild, ViewChildren, ElementRef, QueryList, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { Device } from '../../device/device';
import { Subscription, interval } from 'rxjs';


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
        `api/device/${el.nativeElement.getAttribute("device-id")}/frame/latest?${Date.now()}`,
        {
          params: {"preview": true, "timestamp": `${Date.now()}`},
          responseType: 'blob'
        }
      ).subscribe({
        next: (blob: Blob) => {
          const arrayBuffer = blob.arrayBuffer().then((arrayBuffer) => {
            const data = new DataView(arrayBuffer);
            let offset = 0;
            const frame_id = data.getUint32(offset, true);
            offset += 4;
            const length = data.getUint32(offset, true);
            offset += 4;
            const imageBytes = arrayBuffer.slice(offset, offset + length);
            offset += length;
            const blob = new Blob([imageBytes], { type: 'image/jpeg' });

            if (el.nativeElement.src) {
              URL.revokeObjectURL(el.nativeElement.src);
            }

            el.nativeElement.setAttribute("frame-id", frame_id);
            el.nativeElement.src = URL.createObjectURL(blob);
          });
        },
      });
    });
  }

  showBig(event: Event) {
    this.apiService.get(
      `api/device/${(event.target as HTMLElement).getAttribute("device-id")}/frame/${(event.target as HTMLElement).getAttribute("frame-id")}?${Date.now()}`,
      { responseType: 'blob' }
    ).subscribe({
      next: (blob: Blob) => {
        const arrayBuffer = blob.arrayBuffer().then((arrayBuffer) => {
          const data = new DataView(arrayBuffer);
          let offset = 0;
          const frame_id = data.getUint32(offset, true);
          offset += 4;
          const length = data.getUint32(offset, true);
          offset += 4;
          const imageBytes = arrayBuffer.slice(offset, offset + length);
          offset += length;
          const blob = new Blob([imageBytes], { type: 'image/jpeg' });

          if (this.cnodeFrameBig.nativeElement.src) {
            URL.revokeObjectURL(this.cnodeFrameBig.nativeElement.src);
          }

          this.cnodeFrameBig.nativeElement.src = URL.createObjectURL(blob);
        });
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
