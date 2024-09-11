import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { Connector, PageEvent } from '../connector';
import { ConnectorEditComponent } from '../connector-edit/connector-edit.component';
import { ConnectorCreateComponent } from '../connector-create/connector-create.component';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';
import { ConnectorDeleteComponent } from '../connector-delete/connector-delete.component';

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
    ConnectorDeleteComponent,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './connector-list.component.html',
  styleUrl: './connector-list.component.css',
})
export class ConnectorListComponent {
  value!: string;
  visibleDialog: boolean = false;
  connectorList: Connector[] = [];
  selectedConnector: Connector[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecords!: number;

  options = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

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

  onPageChange(event: PageEvent) {
    this.first = event!.first;
    this.rows = event!.rows;
  }

  constructor(private brokerService: MqttBrokerServiceService) {
    this.brokerService.loadConnectorList().subscribe({
      next: (response: { responses: any[] }) => {
        const clientResponse = response.responses.find(
          (r: { command: string }) => r.command === 'listClients',
        );

        if (clientResponse) {
          const clientData = clientResponse.data;
          const disabled = clientResponse.verbose;

          if (clientData?.clients) {
            this.connectorList = clientData.clients.map((client: string) => ({
              clients: client,
              communication: disabled ? 'Blocked' : 'Allowed',
              lastseen: this.formatDate(new Date()),
            }));
            this.totalRecords = this.connectorList.length;
          }
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
  showDialog() {
    if (!this.selectedConnector) {
      alert('No connector selected');
      return;
    }
    this.visibleDialog = true;
  }

  onDeleteConnector() {
    const connectorId = this.selectedConnector.map(
      (connector) => connector.clients,
    );
    this.brokerService.deleteConnectors(connectorId).subscribe({
      next: (response: { responses: any[] }) => {
        const deleteResponse = response.responses.find(
          (r: { command: string }) => r.command === 'deleteConnectors',
        );

        if (deleteResponse) {
          const deletedConnectors = deleteResponse.deleted || [];
          this.connectorList = this.connectorList.filter(
            (connector) => !deletedConnectors.includes(connector.clients),
          );
          this.totalRecords = this.connectorList.length;
        }

        this.visibleDialog = false;
      },
    });
  }
}
