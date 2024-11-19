import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { Authbundle } from '../authbundle';
import { AuthbundleCreateComponent } from '../authbundle-create/authbundle-create.component';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { AuthbundleDeleteComponent } from '../authbundle-delete/authbundle-delete.component';
import { ApiService } from '../../../services/api.service';

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
export class AuthbundleListComponent implements OnInit {
  visibleDialog: boolean = false;
  authbundleList: Authbundle[] = [];
  selectedAuthbundle: Authbundle[] = [];
  totalRecords!: number;
  authbundleid = '';

  showMessage: boolean = false;

  menubarItems: MenuItem[] = [
    {
      routerLink: '/authbundles/authbundle-create',
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

  apiService = inject(ApiService);
  router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.loadAuthbundles();
  }

  loadAuthbundles() {
    this.apiService.listAuthbundles().subscribe((resp) => {
      if (resp.length === 0) {
        this.showMessage = !this.showMessage;
      } else {
        this.authbundleList = resp;
      }
    });
  }

  showDialog() {
    if (this.selectedAuthbundle.length === 0) {
      alert('No authbundles selected');
      return;
    }
    this.visibleDialog = true;
  }

  onDeleteAuthbundle() {
    const ids = this.selectedAuthbundle.map(
      (authbundle) => authbundle.authbundle_id,
    );
    this.apiService.deleteAuthbundles(ids).subscribe({
      next: (response: { deleted: any[] }) => {
        const deletedAuthbundles = response.deleted || [];
        this.authbundleList = this.authbundleList.filter(
          (authbundle) =>
            !deletedAuthbundles.includes(authbundle.authbundle_id),
        );
        this.totalRecords = this.authbundleList.length;
        this.visibleDialog = false;
      },
    });
  }
}
