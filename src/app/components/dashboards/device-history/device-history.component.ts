import { Component, ViewChild, ViewChildren, ElementRef, QueryList, Input, HostListener, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription, interval } from 'rxjs';

import { decode as cbor_decode } from 'cbor2';

import { DateTime } from 'luxon';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { ApiService } from '../../../services/api.service';
import { Device } from '../../device/device';
import { formatSensorData, createPlaceholderBlob } from '../utils';


@Component({
  selector: 'app-device-history',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorModule,
  ],
  templateUrl: './device-history.component.html',
  styleUrl: './device-history.component.css'
})
export class DeviceHistoryComponent {
  apiService = inject(ApiService);

  @Input() deviceId!: any;

  @ViewChildren('cnodeFrame') cnodeFrames!: QueryList<ElementRef>;
  @ViewChild('cnodeFrameBig') cnodeFrameBig!: ElementRef;

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.hideBig(event);
  }

  deviceHistoricalData: Array<Record<string, any>> = [{"created": "", "data": []}];
  isOpen: boolean = false;

  private cnodeFramesSubscription!: Subscription;

  public dataPointsPerPage = 12;
  public dataPointStartIx = 0;

  constructor() {}

  ngAfterViewInit() {
    this.updateFrames();
  }

  ngOnDestroy() {
    this.cnodeFramesSubscription?.unsubscribe();

    this.cnodeFrames?.forEach((el: ElementRef, index) => {
      if (el.nativeElement.src) {
        URL.revokeObjectURL(el.nativeElement.src);
      }
    });
  }

  updateFrames() {
    this.apiService.get(
      `api/device/${this.deviceId}/history-data/${this.dataPointStartIx}-${this.dataPointsPerPage}`,
      {
        params: {"preview": true, "timestamp": `${Date.now()}`},
        responseType: 'arraybuffer'
      }
    ).subscribe({
      next: (arrayBuffer: ArrayBuffer) => {
        const cbor_encoded = new Uint8Array(arrayBuffer);
        const decoded = cbor_decode(cbor_encoded) as Array<Object>;

        this.deviceHistoricalData = [];
        this.cnodeFrames?.forEach((el: ElementRef, index) => {
          if (index >= decoded.length) { return; }

          this.deviceHistoricalData.push({"data": []});

          for (const [key, value] of Object.entries(decoded[index])) {
            if (key == "frame_id")
            {
              el.nativeElement.setAttribute("frame-id", value);
            }
            else if (key == "data_frame")
            {
              if (value.length > 0) {
                const blob = new Blob([value], { type: 'image/jpeg' });
                if (el.nativeElement.src) {
                  URL.revokeObjectURL(el.nativeElement.src);
                }
                el.nativeElement.src = URL.createObjectURL(blob);
              }
              else{
                el.nativeElement.src = createPlaceholderBlob(300, 168);
              }
            }
            else if (key == "sensor_data")
            {
              for ( const sensor of value ) {
                this.deviceHistoricalData[index]["data"].push(sensor);
                sensor.value = formatSensorData(sensor.value);
              };
            }
            else if (key == "created")
            {
              this.deviceHistoricalData[index]["created"] = DateTime.fromJSDate(value).toFormat('yyyy-MM-dd HH:mm');
            }
          }
        });
      },
    });
  }

  onPageChange(state: PaginatorState) {
    this.dataPointStartIx = state.first ?? this.dataPointStartIx;
    this.dataPointsPerPage = state.rows ?? this.dataPointsPerPage;

    // We need to wait for re-rendering of IMG tags with new SRC
    setTimeout(() => {this.updateFrames();}, 0);
  }

  showBig(event: Event) {
    this.apiService.get(
      `api/device/${this.deviceId}/frame/${(event.target as HTMLElement).getAttribute("frame-id")}?${Date.now()}`,
      {
        params: {"preview": false, "timestamp": `${Date.now()}`},
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

}
