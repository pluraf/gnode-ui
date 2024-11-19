import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { AuthbundleDeleteComponent } from '../authbundle-delete/authbundle-delete.component';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-authbundle-detail',
  standalone: true,
  imports: [TableModule, AuthbundleDeleteComponent, SubheaderComponent],
  templateUrl: './authbundle-detail.component.html',
  styleUrl: './authbundle-detail.component.css',
})
export class AuthbundleDetailComponent {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  authbundleId: string = '';
  authbundle: any;
  details: any;
  visibleDialog: boolean = false;
  menubarItems: MenuItem[] = [];

  constructor() {
    this.authbundleId = this.route.snapshot.params['authbundleId'];
    this.loadAuthbundleDetails(this.authbundleId);
    this.menubarItems = [
      {
        routerLink: ['/authbundles/authbundle-edit', this.authbundleId],
        tooltipOptions: {
          tooltipEvent: 'hover',
          tooltipPosition: 'bottom',
          tooltipLabel: 'Edit authbundle',
        },
        iconClass: 'pi pi-pencil m-1',
      },
      {
        tooltipOptions: {
          tooltipEvent: 'hover',
          tooltipPosition: 'bottom',
          tooltipLabel: 'Delete channel',
        },
        iconClass: 'pi pi-trash m-1',
        command: () => {
          this.showDialog();
        },
      },
    ];
  }

  loadAuthbundleDetails(authbundleId: string) {
    this.apiService.getAuthbundles(authbundleId).subscribe((response: any) => {
      if (response) {
        this.authbundle = response;
        this.details = [
          ['Type', this.authbundle.connector_type],
          ['Authentication type', this.authbundle.auth_type],
          ['Username', this.authbundle.username],
          ['Description', this.authbundle.description],
        ];
      }
    });
  }

  showDialog() {
    this.visibleDialog = true;
  }

  onDeleteAuthbundle() {
    const ids = [this.authbundleId];
    this.apiService.deleteAuthbundles(ids).subscribe({
      next: (response: any) => {
        if (response.success || response.status === 'success') {
          this.details = [];
          this.authbundle = null;
        }
        this.visibleDialog = false;
        this.router.navigateByUrl('/authbundles');
      },
    });
  }
}
