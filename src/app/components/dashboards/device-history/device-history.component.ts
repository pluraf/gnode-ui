import { Component, ViewChildren, ElementRef, QueryList, Input, afterNextRender, inject } from '@angular/core';

import { Subscription, interval } from 'rxjs';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';

import { ApiService } from '../../../services/api.service';
import { Device } from '../../device/device';


@Component({
  selector: 'app-device-history',
  standalone: true,
  imports: [PaginatorModule],
  templateUrl: './device-history.component.html',
  styleUrl: './device-history.component.css'
})
export class DeviceHistoryComponent {
  apiService = inject(ApiService);

  @Input() deviceId!: any;

  @ViewChildren('cnodeFrame') cnodeFrames!: QueryList<ElementRef>;

  deviceHistoricalData: Device[] = [];

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
        params: {"resize": 300, "timestamp": `${Date.now()}`},
        responseType: 'blob'
      }
    ).subscribe({
      next: (blob: Blob) => {
        const arrayBuffer = blob.arrayBuffer().then((arrayBuffer) => {
          const data = new DataView(arrayBuffer);
          let offset = 0;

          this.cnodeFrames?.forEach((el: ElementRef, index) => {
            if (offset < data.byteLength) {
                const length = data.getUint32(offset, true);
                offset += 4;
                const imageBytes = arrayBuffer.slice(offset, offset + length);
                offset += length;
                const blob = new Blob([imageBytes], { type: 'image/jpeg' });

                if (el.nativeElement.src) {
                  URL.revokeObjectURL(el.nativeElement.src);
                }
                el.nativeElement.src = URL.createObjectURL(blob);
            }
          });
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

}
