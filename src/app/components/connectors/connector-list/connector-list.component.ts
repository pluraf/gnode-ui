import { Component } from '@angular/core';
import {
  FormsModule,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Connector, Sidemenu, PageEvent } from '../connector';
import { Router, RouterModule } from '@angular/router';
import { ConnectorEditComponent } from '../connector-edit/connector-edit.component';
import { ConnectorCreateComponent } from '../connector-create/connector-create.component';
import { StatusComponent } from '../../sidemenu/status/status.component';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

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
    StatusComponent,
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
  hideDevices: boolean = true;
  hideStatus: boolean = true;
  hideEdit: boolean = true;
  filteredDeviceList: Connector[] = [];

  formGroup!: FormGroup<{ selectedMenu: FormControl<Sidemenu | null> }>;

  sidemenulist: Sidemenu[] = [{ name: 'Devices' }, { name: 'Status' }];
  first: number = 0;
  rows: number = 5;
  totalRecords: number = 5;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  connectorList: Connector[] = [
    {
      id: 0,
      clients: '',
      communication: 'Allowed',
      lastseen: this.formatDate(new Date()),
    },
    {
      id: 1,
      clients: '',
      communication: 'Allowed',
      lastseen: this.formatDate(new Date()),
    },
    {
      id: 2,
      clients: '',
      communication: 'Allowed',
      lastseen: this.formatDate(new Date()),
    },
  ];
  data: any;

  onPageChange(event: PageEvent) {
    this.first = event!.first;
    this.rows = event!.rows;
  }
  displayDialog: boolean = false;
  newDevice: boolean = false;
  connector: Connector = { clients: '', communication: '', lastseen: '' };
  selectedConnector!: Connector;
  selectedMenuName: string = 'Devices';

  constructor(
    private router: Router,
    private brokerService: MqttBrokerServiceService,
  ) {
    this.formGroup = new FormGroup({
      selectedMenu: new FormControl<Sidemenu | null>(null),
    });
    this.brokerService.testBroker().subscribe({
      next: (response: { responses: any[] }) => {
        console.log(response);
        this.data = response.responses.find(
          (r: { command: string }) => r.command === 'listClients',
        )?.data;
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

  onMenuSelect(event: any) {
    const selectedItem = event.value;
    if (selectedItem) {
      this.selectedMenuName = selectedItem.name;
      if (this.selectedMenuName === 'Status') {
        this.hideStatus = false;
      }
    }
  }

  onRowSelect(event: any) {
    this.router.navigateByUrl('/connector-detail');
  }
}
