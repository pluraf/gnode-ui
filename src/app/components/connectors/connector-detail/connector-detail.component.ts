import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [CommonModule, SubheaderComponent, TableModule],
  templateUrl: './connector-detail.component.html',
  styleUrl: './connector-detail.component.css',
})
export class ConnectorDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  brokerService = inject(MqttBrokerServiceService);
  connid = '';
  connector: any;
  details: any;
  menubarItems: MenuItem[] = [
    {
      routerLink: '/connector-edit',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Edit connector',
      },
      iconClass: 'pi pi-pencil m-3',
    },
    {
      routerLink: '/connector-delete',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Delete connector',
      },
      iconClass: 'pi pi-trash m-3',
    },
  ];

  constructor() {
    this.connid = this.route.snapshot.params['connid'];
    this.brokerService.loadConnectorDetails(this.connid).subscribe((response: any) => {
      this.connector = response.responses[0].data.client;
      this.details = [
        ['Enabled', !this.connector.disabled],
        ['Last seen', 'date'],
        ['Authentication type', this.connector.authtype],
        ['Username', this.connector.username],
        ['MQTT Client ID', this.connector.clientid],
      ];
      if (this.connector.authtype.startsWith('jwt')) {
        this.details.push([
          'JWT key',
          this.connector.jwtkey.replace(/(.{64})/g, '$1\n'),
        ]);
      }
    });
  }
}
