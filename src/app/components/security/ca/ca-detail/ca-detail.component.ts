import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { SubheaderComponent } from '../../../subheader/subheader.component';
import { ApiService } from '../../../../services/api.service';
import { DeleteComponent } from '../../../shared/delete/delete.component';
import { CAComponent } from '../ca';

@Component({
  selector: 'app-certificate-detail',
  standalone: true,
  imports: [TableModule, SubheaderComponent, DeleteComponent],
  templateUrl: './ca-detail.component.html',
  styleUrl: './ca-detail.component.css',
})
export class CADetailsComponent extends CAComponent {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  details!: any;
  fileMetaData!: any;
  visibleDialog = false;
  menubarItems: MenuItem[] = [];

  constructor() {
    super();
    this.caId = this.route.snapshot.params['caId'];
    this.loadDetails(this.caId);
    this.menubarItems = [
      {
        routerLink: ['/ca/ca-edit', this.caId],
        tooltipOptions: {
          tooltipEvent: 'hover',
          tooltipPosition: 'bottom',
          tooltipLabel: 'Edit CA Certificate',
        },
        iconClass: 'pi pi-pencil m-1',
      },
      {
        tooltipOptions: {
          tooltipEvent: 'hover',
          tooltipPosition: 'bottom',
          tooltipLabel: 'Delete CA Certificate',
        },
        iconClass: 'pi pi-trash m-1',
        command: () => {
          this.showDialog();
        },
      },
    ];
  }

  loadDetails(caId: string) {
    this.apiService.caGet(caId).subscribe((response: any) => {
      if (response) {
        this.fileMetaData = response;
        this.details = [
          ['CA Certificate ID', this.caId],
          ['Description', this.fileMetaData.description]
        ];
      }
    });
  }

  showDialog() {
    this.visibleDialog = true;
  }

  onDelete() {
    this.apiService.caDelete(this.caId).subscribe({
      next: (response: any) => {
        if (response.success || response.status === 'success') {
          this.details = [];
          this.fileMetaData = null;
        }
        this.visibleDialog = false;
        this.router.navigateByUrl('/ca');
      },
    });
  }
}
