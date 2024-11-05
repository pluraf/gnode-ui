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
import { interval, Subscription } from 'rxjs';

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
  showSpinnerButton: boolean = false;
  isStarting: boolean = false;
  isStopping: boolean = false;
  pollingSubscription: Subscription | null = null;

  constructor() {
    this.pipeid = this.route.snapshot.params['pipeid'];
    this.loadPipelineDetails(this.pipeid);
    this.menubarItems = [
      {
        routerLink: ['/pipelines/pipeline-edit', this.pipeid],
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
        console.log(response);
        this.updatePipelineStatus();
      }
    });
  }

  updatePipelineStatus() {
    this.backendService.getPipelineStatus(this.pipeid).subscribe({
      next: (statusResponse) => {
        this.pipelines.status = statusResponse.status;
        this.pipelines.count_in = statusResponse.count_in;
        this.pipelines.last_in = statusResponse.last_in;
        this.pipelines.count_out = statusResponse.count_out;
        this.pipelines.last_out = statusResponse.last_out;
        this.pipelines.error = statusResponse.error;
        this.updateDetails();

        this.showSpinnerButton = this.pipelines.status === 'running';
        this.isStarting = this.pipelines.status === 'starting';

        if (
          this.pollingSubscription &&
          this.pipelines.status !== 'starting' &&
          this.pipelines.status !== 'stopping'
        ) {
          this.stopPolling();
        }
      },
    });
  }

  updateDetails() {
    this.details = [
      ['Connector In', this.pipelines.connector_in.type],
      ['Connector Out', this.pipelines.connector_out.type],
      ['Pipeline Status', this.pipelines.status],
      ['Messages received', this.pipelines.count_in],
      ['Last message received timestamp', this.pipelines.last_in],
      ['Messages sent', this.pipelines.count_out],
      ['Last message sent timestamp', this.pipelines.last_out],
    ];

    if (
      this.pipelines.status === 'malformed' ||
      this.pipelines.status === 'failed'
    ) {
      this.details.push(['Error', this.pipelines.error]);
      if (this.pipelines.status === 'starting') {
        this.details = this.details.filter(
          (detail: any) => detail[0] !== 'Error',
        );
        this.pipelines.error = null;
      }
    }
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

  OnStartSpinner() {
    if (
      this.pipelines.status === 'malformed' ||
      this.pipelines.status === 'failed'
    ) {
      this.details = this.details.filter(
        (detail: any) => detail[0] !== 'Error',
      );
      this.pipelines.error = null;
    }

    this.isStarting = true;

    this.backendService.startPipeline(this.pipeid).subscribe({
      next: () => {
        this.startPolling();
      },
      complete: () => {
        setTimeout(() => {
          this.isStarting = false;
        }, 1000);
      },
    });
  }

  OnStopSpinner() {
    this.isStopping = true;
    this.backendService.stopPipeline(this.pipeid).subscribe({
      next: () => {
        this.startPolling();
      },
      complete: () => {
        setTimeout(() => {
          this.isStopping = false;
        }, 1000);
      },
    });
  }

  startPolling() {
    this.stopPolling();
    this.pollingSubscription = interval(1000).subscribe(() => {
      this.updatePipelineStatus();
    });
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }
}
