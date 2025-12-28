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
    this.cnodeFrames?.forEach((el: ElementRef, index) => {
      this.apiService.get(
        `api/device/${this.deviceId}/history-data/${el.nativeElement.id}?${Date.now()}`,
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

  onPageChange(state: PaginatorState) {
    this.dataPointStartIx = state.first ?? this.dataPointStartIx;
    this.dataPointsPerPage = state.rows ?? this.dataPointsPerPage;

    // We need to wait for re-rendering of IMG tags with new SRC
    setTimeout(() => {this.updateFrames();}, 0);
  }

}
