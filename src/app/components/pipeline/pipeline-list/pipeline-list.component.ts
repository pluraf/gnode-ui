import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { catchError, forkJoin, Observable, of } from 'rxjs';

import { MenuItem, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { ApiService } from '../../../services/api.service';
import { NoteService } from '../../../services/note.service';
import { DeleteComponent } from '../../shared/delete/delete.component';

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
    DeleteComponent,
    DialogModule,
    ButtonModule,
    CommonModule,
    ToastModule,
  ],
  providers: [MessageService, NoteService],
  templateUrl: './pipeline-list.component.html',
  styleUrl: './pipeline-list.component.css',
})
export class PipelineListComponent implements OnInit {
  apiService = inject(ApiService);
  noteService = inject(NoteService);
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
      routerLink: '/pipelines/pipeline-create',
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
    this.apiService.pipelineList().subscribe((pipelinesConfig) => {
      if (pipelinesConfig && Object.keys(pipelinesConfig).length > 0) {
        console.log(this.pipelines);
        this.apiService.pipelineStatusList().subscribe((pipelinesStatus) => {
          if (pipelinesStatus && Object.keys(pipelinesStatus).length > 0) {
            this.pipelines = Object.entries(pipelinesConfig).map((entry: any) => ({
              id: entry[0],
              connector_in: entry[1].connector_in.type,
              connector_out: entry[1].connector_out.type,
              status: pipelinesStatus[entry[0]].status,
              error: '',
            }));
          }
        });
      } else {
        this.showMessage = true;
      }
    });
  }

  showDialog() {
    if (this.selectedPipelines.length === 0) {
      this.noteService.handleMessage(
        this.messageService,
        'warn',
        'No pipelines selected.',
      );
      return;
    }
    this.visibleDialog = true;
  }

  onDeletePipelines() {
    let observables: Observable<any>[] = [];
    this.selectedPipelines.map((pipeline) => {
      observables.push(
        this.apiService
          .pipelineDelete(pipeline.id)
          .pipe(catchError((err) => of(true))),
      );
    });

    forkJoin(observables).subscribe({
      next: (response: any) => {
        this.visibleDialog = false;
        this.selectedPipelines = [];
        this.loadPipelines();
      },
      error: (response: any) => {
        this.visibleDialog = false;
        this.selectedPipelines = [];
        this.loadPipelines();
      },
    });
  }
}
