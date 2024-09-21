import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { Authbundle, PageEvent } from '../authbundle';
import { AuthbundleCreateComponent } from '../authbundle-create/authbundle-create.component';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';
import { AuthbundleDeleteComponent } from '../authbundle-delete/authbundle-delete.component';

@Component({
  selector: 'app-authbundle-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AuthbundleCreateComponent,
    SubheaderComponent,
    TableModule,
    PaginatorModule,
    AuthbundleDeleteComponent,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './authbundle-list.component.html',
  styleUrl: './authbundle-list.component.css',
})
export class AuthbundleListComponent {
  value!: string;
  visibleDialog: boolean = false;
  authbundleList: Authbundle[] = [];
  selectedAuthbundle: Authbundle[] = [];
  first: number = 0;
  rows: number = 10;
  totalRecords!: number;
  chanid = '';

  paginatorOptions = [
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  menubarItems: MenuItem[] = [
    {
      routerLink: '/authbundle-create',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create authbundle',
      },
      iconClass: 'pi pi-plus m-1',
    },
    {
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Delete authbundle',
      },
      iconClass: 'pi pi-trash m-1',
      command: () => {
        this.showDialog();
      },
    },
  ];

  onPageChange(event: PageEvent) {
    this.first = event!.first;
    this.rows = event!.rows;
  }

  backendService = inject(BackendService);

  constructor() {
    this.loadAuthbundles();
  }

  loadAuthbundles() {
    this.backendService.listAuthbundles().subscribe({
      next: (response: { responses: any[] }) => {
        const clientResponse = response.responses.find(
          (r: { command: string }) => r.command === 'listClients',
        );

        if (clientResponse) {
          const clientData = clientResponse.data;
          const disabled = clientResponse.verbose;
        }
      },
    });
  }

  showDialog() {
    if (this.selectedAuthbundle.length === 0) {
      alert('No authbundles selected');
      return;
    }
    this.chanid = this.selectedAuthbundle[0].id;
    this.visibleDialog = true;
  }

  onDeleteChannel() {
    const ids = this.selectedAuthbundle.map(
      (authbundle) => authbundle.id,
    );
    this.backendService.deleteAuthbundles(ids).subscribe({
      next: (response: { responses: any[] }) => {
        const deleteResponse = response.responses.find(
          (r: { command: string }) => r.command === 'deleteAuthbundles',
        );

        if (deleteResponse) {
          const deletedAuthbundles = deleteResponse.deleted || [];
          this.authbundleList = this.authbundleList.filter(
            (authbundle) => !deletedAuthbundles.includes(authbundle.id),
          );
          this.totalRecords = this.authbundleList.length;
        }

        this.visibleDialog = false;
      },
    });
  }
}
