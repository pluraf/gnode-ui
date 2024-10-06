import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { AuthbundleDeleteComponent } from '../authbundle-delete/authbundle-delete.component';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';

@Component({
  selector: 'app-authbundle-detail',
  standalone: true,
  imports: [TableModule, AuthbundleDeleteComponent, SubheaderComponent],
  templateUrl: './authbundle-detail.component.html',
  styleUrl: './authbundle-detail.component.css',
})
export class AuthbundleDetailComponent {
  backendService = inject(BackendService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  authbundleId: string = '';
  authbundles: any;
  details: any;
  visibleDialog: boolean = false;
  menubarItems: MenuItem[] = [];

  constructor() {
    this.authbundleId = this.route.snapshot.params['authbundleId'];
    this.loadAuthbundleDetails();
    this.menubarItems = [
      {
        routerLink: ['/authbundle-edit', this.authbundleId],
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

  /*   loadAuthbundleDetails(authbundleId: string) {
    this.backendService
      .getAuthbundles(authbundleId)
      .subscribe((response: any) => {
        console.log(response);
        if (response) {
          this.authbundles = response[0];
          this.details = [
            ['Type', this.authbundles.connector_type],
            ['Description', 'descr'],
          ];
        }
      });
  } */

  loadAuthbundleDetails() {
    this.details = [
      ['Type', 'type'],
      ['Description', 'description'],
    ];
  }

  showDialog() {
    this.visibleDialog = true;
  }

  onDeletePipelines() {
    const authbundleids = [this.authbundleId];
    this.backendService
      .pipelineDelete(this.authbundleId, authbundleids)
      .subscribe({
        next: (response: any) => {
          if (response.success || response.status === 'success') {
            this.details = [];
            this.authbundles = null;
          }
          this.visibleDialog = false;
          this.router.navigateByUrl('/authbundles');
        },
      });
  }
}
