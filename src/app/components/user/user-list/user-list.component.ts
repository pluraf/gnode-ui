import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { UserService } from '../../../services/user.service';

import { PageEvent } from '../../channel/channel';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { UserDeleteComponent } from '../user-delete/user-delete.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    SubheaderComponent,
    TableModule,
    PaginatorModule,
    UserDeleteComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  userService = inject(UserService);
  visibleDialog: boolean = false;
  selectedUsers: any[] = [];
  first: number = 0;
  rows: number = 5;
  totalRecords = 0;
  users: any[] = [];

  paginatorOptions = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  menubarItems: MenuItem[] = [
    {
      routerLink: '/user-create',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create user',
      },
      iconClass: 'pi pi-plus m-1',
    },
    {
      routerLink: '/user-edit',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Edit user',
      },
      iconClass: 'pi pi-pencil m-1',
    },
    {
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Delete user',
      },
      iconClass: 'pi pi-trash m-1',
      command: () => {
        this.showDialog();
      },
    },
  ];

  constructor() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe((res: any) => {
      this.users = res;
      this.totalRecords = this.users.length;
    });
  }

  onDeleteUser() {
    const userIds: any[] = this.selectedUsers.map((user) => user.id);

    this.userService.deleteUsers(userIds).subscribe({
      next: (resp: any) => {
        const deleted = resp.deleted;
        this.users = this.users.filter((user) => !deleted.includes(user.id));
        this.visibleDialog = false;
        this.selectedUsers = [];
      },
      error: (err) => {
        console.error('Error deleting users:', err);
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
  }

  showDialog() {
    if (this.selectedUsers.length === 0) {
      alert('No users selected');
      return;
    }
    this.visibleDialog = true;
  }
}
