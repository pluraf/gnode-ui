import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { PageEvent } from '../../connectors/connector';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SubheaderComponent, TableModule, PaginatorModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  menubarItems: MenuItem[] = [
    {
      routerLink: '/user-create',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create user',
      },
      iconClass: 'pi pi-plus m-3',
    },
    {
      routerLink: '/user-edit',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Edit user',
      },
      iconClass: 'pi pi-pencil m-3',
    },
    {
      routerLink: '/user-delete',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Delete user',
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

  userList = [
    {
      name: 'User1',
      role: 'Test',
    },
    {
      name: 'User2',
      role: 'Test',
    },
  ];

  constructor() {}
}
