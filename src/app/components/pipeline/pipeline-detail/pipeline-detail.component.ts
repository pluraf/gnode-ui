import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { PipelineDeleteComponent } from '../pipeline-delete/pipeline-delete.component';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { interval, Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';

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
  [x: string]: any;
  apiService = inject(ApiService);
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
    this.apiService.pipelineGet(pipeid).subscribe((response: any) => {
      if (response) {
        this.pipelines = response;
        this.updatePipelineStatus();
      }
    });
  }

  updatePipelineStatus() {
    this.apiService.getPipelineStatus(this.pipeid).subscribe({
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
    const lastReceivedTimestamp = this.pipelines.last_in;
    const iso8601Received = new Date(lastReceivedTimestamp * 1000);
    let recivedTimestamp = iso8601Received
      .toString()
      .slice(0, iso8601Received.toString().indexOf('GMT'));
    const lastSentTimestamp = this.pipelines.last_out;
    const iso8601Sent = new Date(lastSentTimestamp * 1000);
    let sentTimestamp = iso8601Sent
      .toString()
      .slice(0, iso8601Sent.toString().indexOf('GMT'));

    this.details = [
      ['Connector In', this.pipelines.connector_in.type],
      ['Connector Out', this.pipelines.connector_out.type],
      ['Pipeline Status', this.pipelines.status],
      ['Messages received', this.pipelines.count_in],
      ['Last message received timestamp', recivedTimestamp],
      ['Messages sent', this.pipelines.count_out],
      ['Last message sent timestamp', sentTimestamp],
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
    this.apiService.pipelineDelete(this.pipeid, pipeids).subscribe({
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

    this.apiService.startPipeline(this.pipeid).subscribe({
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
    this.apiService.stopPipeline(this.pipeid).subscribe({
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
