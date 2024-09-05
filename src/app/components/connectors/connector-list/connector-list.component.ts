import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Connector, PageEvent } from '../connector';
import { Router, RouterModule } from '@angular/router';
import { ConnectorEditComponent } from '../connector-edit/connector-edit.component';
import { ConnectorCreateComponent } from '../connector-create/connector-create.component';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-connector-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ConnectorCreateComponent,
    ConnectorEditComponent,
    ConnectorEditComponent,
    SubheaderComponent,
    TableModule,
    PaginatorModule,
  ],
  templateUrl: './connector-list.component.html',
  styleUrl: './connector-list.component.css',
})
export class ConnectorListComponent {
  value!: string;

  menubarItems: MenuItem[] = [
    {
      routerLink: '/connector-create',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create connector',
      },
      iconClass: 'pi pi-plus m-3',
    },
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

  first: number = 0;
  rows: number = 5;
  totalRecords: number = 5;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  onPageChange(event: PageEvent) {
    this.first = event!.first;
    this.rows = event!.rows;
  }

  connectorList: Connector[] = [];
  selectedConnector!: Connector;

  constructor(private brokerService: MqttBrokerServiceService) {
    this.brokerService.loadConnectorList().subscribe({
      next: (response: { responses: any[] }) => {
        console.log(response);
        const clientData = response.responses.find(
          (r: { command: string }) => r.command === 'listClients',
        )?.data;
        if (clientData) {
          this.connectorList = clientData.clients.map((connid: string) => ({
            connid: connid,
            communication: 'Allowed',
            lastseen: this.formatDate(new Date()),
          }));
          this.totalRecords = this.connectorList.length;
        }
      },
    });
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-EU', options);
  }
}
