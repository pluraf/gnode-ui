import { Component, inject } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';

import { catchError, forkJoin, Observable, of } from 'rxjs';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { ApiService } from '../../../services/api.service';
import { NoteService } from '../../../services/note.service';
import { DeleteComponent } from '../../shared/delete/delete.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    SubheaderComponent,
    TableModule,
    PaginatorModule,
    DeleteComponent,
    ToastModule,
  ],
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
    this.loadUsers();
  }

  loadUsers() {
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
    let observables: Observable<any>[] = [];
    this.selectedUsers.map((user) => {
      observables.push(
        this.apiService.deleteUser(user.id).pipe(catchError((err) => {
          this.noteService.handleError(err);
          return of(true);
        })),
      );
    });

    forkJoin(observables).subscribe({
      next: (response: any) => {
        this.visibleDialog = false;
        this.selectedUsers = [];
        this.loadUsers();
      },
      error: (response: any) => {
        this.visibleDialog = false;
        this.selectedUsers = [];
        this.loadUsers();
      },
    });
  }
}
