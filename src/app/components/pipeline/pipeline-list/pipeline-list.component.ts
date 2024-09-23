import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';


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
    PaginatorModule
  ],
  templateUrl: './pipeline-list.component.html',
  styleUrl: './pipeline-list.component.css',
})
export class PipelineListComponent {
  backendSerice = inject(BackendService);

  pipelines: Pipeline[] = [];
  selectedPipelines: Pipeline[] = [];

  first: number = 0;
  rows: number = 10;

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
    },
  ];

  paginatorOptions = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
  ];

  constructor() {
    this.load();
  }

  load() {
    this.backendSerice.pipelinesList().subscribe((response) => {
      console.log(response);

      this.pipelines = Object.entries(response).map((entry: any) => ({
        id: entry[0],
        connector_in: entry[1].connector_in.type,
        connector_out: entry[1].connector_out.type,
        description: "descr"
      }));
    });
  }

  onDeletePipelines() {
  }

  onPageChange(event: any) {
    this.first = event!.first;
    this.rows = event!.rows;
  }

  pipelineList = [
    {
      name: 'Pipeline1',
      key: 'Test',
    },
    {
      name: 'Pipeline2',
      key: 'Test',
    },
  ];
}
