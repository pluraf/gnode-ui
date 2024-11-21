import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { UserService } from '../../../services/user.service';

import { PageEvent } from '../../channel/channel';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { UserDeleteComponent } from '../user-delete/user-delete.component';
import { ApiService } from '../../../services/api.service';

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
  apiService = inject(ApiService);

  visibleDialog: boolean = false;
  selectedUsers: any[] = [];
  totalRecords = 0;
  users: any[] = [];

  menubarItems: MenuItem[] = [
    {
      routerLink: ['/user-create'],
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create user',
      },
      iconClass: 'pi pi-plus m-1',
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
    this.apiService.getUsers().subscribe((res: any) => {
      this.users = res;
      this.totalRecords = this.users.length;
    });
  }

  showDialog() {
    if (this.selectedUsers.length === 0) {
      alert('No users selected');
      return;
    }
    this.visibleDialog = true;
  }

  onDeleteUser() {
    const userIds: any[] = this.selectedUsers.map((user) => user.id);

    this.apiService.deleteUsers(userIds).subscribe({
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
}
