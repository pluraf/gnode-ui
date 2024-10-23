import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';

import { SubheaderComponent } from '../subheader/subheader.component';
import { TabViewModule } from 'primeng/tabview';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    FormsModule,
    SubheaderComponent,
    TableModule,
    TabViewModule,
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  backendService = inject(BackendService);
  details: any[] = [
    ['Name', 'Network Status'],
    ['Status', 'Running/Stop'],
    ['Uptime', ''],

    /*       [1, 'Network Status', 'descr', 'Running/Stop'],
      [2, 'G-Node Cloud Status', 'descr', 'Running/Stop'] */
  ];
  details2: any[] = [
    ['Name', 'G-Cloud Status'],
    ['Status', 'Running/Stop'],
    ['Uptime', ''],
  ];

  loadStatusDetails(name: string) {
    /* 
    this.backendService
      .getNetworkStatus(networkName)
      .subscribe((response: any) => {
        if (response) {
          this.networkName = response;
          this.details = [
            ['Name', 'type'],
            ['Id', ''],
            ['Uptime', ''],
          ];
        }
      }); */
  }
}
