import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';

import { SubheaderComponent } from '../subheader/subheader.component';
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
    DividerModule
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  backendService = inject(BackendService);
  networkDetails: any[] = [
    ['IP address', '-.-.-.-'],
    ['Netmask', '-.-.-.-'],
    ['Gateway', '-.-.-.-'],
    ['DNS', '-.-.-.-']
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
    this.backendService.getStatus().subscribe((response: any) => {
      console.log(response);
      this.networkDetails = [
        ['IP Address', response.network['ipv4']],
        ['Netmask', response.network['netmask']],
        ['Gateway', response.network['gateway']],
        ['DNS', response.network['dns']]
      ];
      this.serviceDetails = [
        ['M2E-Bridge', response.service['m2eb']],
        ['M-Broker-C', response.service['mqbc']],
        ['G-Cloud Client', response.service['gcloud_client']],
      ];
    });
  }
}
