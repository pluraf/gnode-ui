import { Component, inject } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { UserDeleteComponent } from '../user-delete/user-delete.component';
import { ApiService } from '../../../services/api.service';
import { NoteService } from '../../../services/note.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    SubheaderComponent,
    TableModule,
    PaginatorModule,
    UserDeleteComponent,
    ToastModule,
  ],
  providers: [MessageService, NoteService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

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
      this.noteService.handleMessage(
        this.messageService,
        'warn',
        'No users selected.',
      );
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
