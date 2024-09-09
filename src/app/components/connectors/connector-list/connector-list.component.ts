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
import { ConnectorDeleteComponent } from '../connector-delete/connector-delete.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

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
        console.log('API Response:', response);

        const clientResponse = response.responses.find(
          (r: { command: string }) => r.command === 'listClients',
        );

        if (clientResponse) {
          const clientData = clientResponse.data;
          const verbose = clientResponse.verbose;
          console.log('verbose:', verbose);

          if (clientData?.clients) {
            this.connectorList = clientData.clients.map((client: string) => ({
              clients: client,
              communication: verbose ? 'Blocked' : 'Allowed',
              lastseen: this.formatDate(new Date()),
            }));
            this.totalRecords = this.connectorList.length;
            console.log('Connector List:', this.connectorList);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching connectors:', err);
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

  deleteConnector() {
    if (!this.selectedConnector) {
      alert('No connector selected for deletion');
      return;
    }

    console.log('Selected connector:', this.selectedConnector);

    /*  this.brokerService
      .deleteConnectors(this.selectedConnector.clients)
      .subscribe({
        next: (response) => {
          console.log(
            `Connector ${this.selectedConnector.clients} deleted successfully`,
          );

          this.connectorList = this.connectorList.filter(
            (connector) => connector.clients !== this.selectedConnector.clients,
          );

          this.totalRecords = this.connectorList.length;
          this.visibleDialog = false;
        },
        error: (err) => {
          console.error('Error deleting connector:', err);
        },
      }); */
  }
}
