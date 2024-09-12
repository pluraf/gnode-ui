import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';
import { ConnectorDeleteComponent } from '../connector-delete/connector-delete.component';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [
    CommonModule,
    SubheaderComponent,
    TableModule,
    RouterModule,
    ConnectorDeleteComponent,
  ],
  templateUrl: './connector-detail.component.html',
  styleUrl: './connector-detail.component.css',
})
export class ConnectorDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  brokerService = inject(MqttBrokerServiceService);
  connid = '';
  connector: any;
  details: any;
  visibleDialog: boolean = false;
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
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Delete connector',
      },
      iconClass: 'pi pi-trash m-3',
      command: () => {
        this.showDialog();
      },
    },
  ];

  constructor(private router: Router) {
    this.connid = this.route.snapshot.params['connid'];
    this.brokerService
      .loadConnectorDetails(this.connid)
      .subscribe((response: any) => {
        this.connector = response.responses[0].data.client;
        this.details = [
          ['Enabled', !this.connector.disabled],
          ['Last seen', 'date'],
          ['Authentication type', this.connector.authtype],
          ['Username', this.connector.username],
          ['MQTT Client ID', this.connector.clientid],
        ];
        if (
          this.connector.authtype &&
          this.connector.authtype.startsWith('jwt')
        ) {
          this.details.push([
            'JWT key',
            this.connector.jwtkey.replace(/(.{64})/g, '$1\n'),
          ]);
        }
      });
  }

  showDialog() {
    this.visibleDialog = true;
  }

  onDeleteConnector() {
    this.brokerService.deleteConnectors([this.connid]).subscribe({
      next: (response: any) => {
        if (response.success || response.status === 'success') {
          this.details = [];
          this.connector = null;
        }
        this.visibleDialog = false;
        this.router.navigateByUrl('/connectors');
      },
    });
  }
}
