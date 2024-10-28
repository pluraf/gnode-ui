import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';
import { PipelineDeleteComponent } from '../pipeline-delete/pipeline-delete.component';

export interface Pipeline {
  id: string;
  connector_in: string;
  connector_out: string;
  status?: string;
  error?: string;
}

@Component({
  selector: 'app-pipeline-list',
  standalone: true,
  imports: [
    SubheaderComponent,
    TableModule,
    RouterModule,
    PaginatorModule,
    PipelineDeleteComponent,
    DialogModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './pipeline-list.component.html',
  styleUrl: './pipeline-list.component.css',
})
export class PipelineListComponent implements OnInit {
  backendService = inject(BackendService);

  visibleDialog: boolean = false;
  pipelines: Pipeline[] = [];
  selectedPipelines: Pipeline[] = [];
  pipeid = '';
  errorMessage: string = '';
  showMessage: boolean = false;

  first: number = 0;
  rows: number = 10;
  totalRecords!: number;

  menubarActions: MenuItem[] = [
    {
      routerLink: '/pipeline-create',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create pipeline',
      },
      iconClass: 'pi pi-plus m-1',
    },
    {
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Delete pipeline',
      },
      iconClass: 'pi pi-trash m-1',
      command: () => {
        this.showDialog();
      },
    },
  ];

  ngOnInit() {
    this.loadPipelines();
  }

  loadPipelines() {
    this.backendService.pipelinesList().subscribe((response) => {
      if (response && Object.keys(response).length > 0) {
        this.pipelines = Object.entries(response).map((entry: any) => ({
          id: entry[0],
          connector_in: entry[1].connector_in.type,
          connector_out: entry[1].connector_out.type,
          status: '',
          error: '',
        }));

        // Fetch the status for each pipeline
        this.pipelines.forEach((pipeline: any) => {
          this.backendService
            .getPipelineStatus(pipeline.id)
            .subscribe((statusResponse) => {
              pipeline.status = statusResponse.status;
              pipeline.error = statusResponse.error;
            });
        });
      } else {
        this.showMessage = true;
      }
    });
  }

  showDialog() {
    if (this.selectedPipelines.length === 0) {
      alert('No pipeline selected');
      return;
    }
    this.visibleDialog = true;
  }

  onDeletePipelines() {
    const pipelineIDs = this.selectedPipelines.map((pipeline) => pipeline.id);
    this.backendService.pipelineDelete(this.pipeid, pipelineIDs).subscribe({
      next: (response: { deleted: string[] }) => {
        const deletedPipelines = response.deleted || [];
        this.pipelines = this.pipelines.filter(
          (pipeline) => !deletedPipelines.includes(pipeline.id),
        );

        this.totalRecords = this.pipelines.length;
        this.visibleDialog = false;
      },
    });
  }
}
