import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MenuItem, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';
import { PipelineDeleteComponent } from '../pipeline-delete/pipeline-delete.component';

export interface Pipeline {
  id: string;
  connector_in: string;
  connector_out: string;
  description: string;
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
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './pipeline-list.component.html',
  styleUrl: './pipeline-list.component.css',
})
export class PipelineListComponent {
  backendService = inject(BackendService);
  messageService = inject(MessageService);

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

  constructor() {
    this.load();
  }

  load() {
    this.backendService.pipelinesList().subscribe((response) => {
      if (response.length === 0) {
        this.showMessage = true;
      } else {
        this.pipelines = Object.entries(response).map((entry: any) => ({
          id: entry[0],
          connector_in: entry[1].connector_in.type,
          connector_out: entry[1].connector_out.type,
          description: 'descr',
        }));
      }
    });
  }

  showDialog() {
    if (this.selectedPipelines.length === 0) {
      /* alert('No pipeline selected'); */
      this.messageService.add({
        severity: 'info',
        detail: 'No pipeline selected',
      });
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
