import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';
import { PipelineDeleteComponent } from '../pipeline-delete/pipeline-delete.component';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-pipeline-detail',
  standalone: true,
  imports: [
    SubheaderComponent,
    TableModule,
    PipelineDeleteComponent,
    ButtonModule,
    CommonModule,
    TooltipModule,
  ],
  templateUrl: './pipeline-detail.component.html',
  styleUrl: './pipeline-detail.component.css',
})
export class PipelineDetailComponent {
  backendService = inject(BackendService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  pipeid: string = '';
  pipelines: any;
  details: any;
  visibleDialog: boolean = false;
  menubarItems: MenuItem[] = [];
  isStartSpinning: boolean = false;
  isStopSpinning: boolean = false;

  constructor() {
    this.pipeid = this.route.snapshot.params['pipeid'];
    this.loadPipelineDetails(this.pipeid);
    this.menubarItems = [
      {
        routerLink: ['/pipeline-edit', this.pipeid],
        tooltipOptions: {
          tooltipEvent: 'hover',
          tooltipPosition: 'bottom',
          tooltipLabel: 'Edit channel',
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

  loadPipelineDetails(pipeid: string) {
    this.backendService.pipelineGet(pipeid).subscribe((response: any) => {
      if (response) {
        this.pipelines = response;
        this.details = [
          ['Connector In', this.pipelines.connector_in.type],
          ['Connector Out', this.pipelines.connector_out.type],
          ['Description', 'descr'],
        ];
      }
    });
  }

  showDialog() {
    this.visibleDialog = true;
  }

  onDeletePipelines() {
    const pipeids = [this.pipeid];
    this.backendService.pipelineDelete(this.pipeid, pipeids).subscribe({
      next: (response: any) => {
        if (response.success || response.status === 'success') {
          this.details = [];
          this.pipelines = null;
        }
        this.visibleDialog = false;
        this.router.navigateByUrl('/pipelines');
      },
    });
  }

  showStartSpinner() {
    this.isStartSpinning = true;
  }

  toggleStopSpinner() {
    this.isStopSpinning = !this.isStopSpinning;
    if (this.isStartSpinning) {
      this.isStartSpinning = false;
    }
  }
}
