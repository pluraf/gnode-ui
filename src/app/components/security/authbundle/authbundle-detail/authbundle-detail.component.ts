import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { SubheaderComponent } from '../../../subheader/subheader.component';
import { ApiService } from '../../../../services/api.service';
import { DeleteComponent } from '../../../shared/delete/delete.component';
import { NoteService } from '../../../../services/note.service';

@Component({
  selector: 'app-authbundle-detail',
  standalone: true,
  imports: [TableModule, SubheaderComponent, DeleteComponent],
  templateUrl: './authbundle-detail.component.html',
  styleUrl: './authbundle-detail.component.css',
})
export class AuthbundleDetailComponent {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  noteService = inject(NoteService);

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
          tooltipLabel: 'Delete authbundle',
        },
        iconClass: 'pi pi-trash m-1',
        command: () => {
          this.showDialog();
        },
      },
    ];
  }

  loadAuthbundleDetails(authbundleId: string) {
    this.apiService.authbundleGet(authbundleId).subscribe((response: any) => {
      if (response) {
        this.authbundle = response;
        this.details = [
          ['Authbundle ID', this.authbundleId],
          ['Type', this.authbundle.auth_type],
          ['Authentication type', this.authbundle.service_type],
        ];
        if (this.authbundle.username !== null) {
          this.details.push(['Username', this.authbundle.username]);
        }
        this.details.push(['Description', this.authbundle.description]);
      }
    });
  }

  showDialog() {
    this.visibleDialog = true;
  }

  onDeleteAuthbundle() {
    this.apiService.authbundleDelete(this.authbundleId).subscribe({
      next: (response: any) => {
        if (response.ok) {
          this.noteService.handleInfo('Authbundle deleted successfully!');
          this.router.navigateByUrl('/authbundles');
        }
        this.visibleDialog = false;
      },
      error: (response: any) => {
        this.noteService.handleError(response);
        this.visibleDialog = false;
      }
    });
  }
}
