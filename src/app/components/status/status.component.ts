import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';

import { SubheaderComponent } from '../subheader/subheader.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    FormsModule,
    SubheaderComponent,
    TableModule,
    DividerModule,
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  apiService = inject(ApiService);
  networkDetails: any[] = [
    ['IP address', '-.-.-.-'],
    ['Netmask', '-.-.-.-'],
    ['Gateway', '-.-.-.-'],
    ['DNS', '-.-.-.-'],
  ];
  serviceDetails: any[] = [
    ['M2E-Bridge', '-'],
    ['M-Broker-C', '-'],
    ['G-Cloud Client', '-'],
  ];

  constructor() {
    this.loadStatusDetails();
  }

  loadStatusDetails() {
    this.apiService.getStatus().subscribe((response: any) => {
      this.networkDetails = [
        ['IP Address', response.network['address']],
        ['Netmask', response.network['netmask']],
        ['Gateway', response.network['gateway']],
        ['DNS', response.network['dns']],
      ];
      this.serviceDetails = [
        ['M2E-Bridge', response.service['m2eb']],
        ['M-Broker-C', response.service['mqbc']],
        ['G-Cloud Client', response.service['gcloud_client']],
      ];
    });
  }
}
