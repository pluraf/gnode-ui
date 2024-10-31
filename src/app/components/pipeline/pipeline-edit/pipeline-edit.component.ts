import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-pipeline-edit',
  standalone: true,
  imports: [
    SubheaderComponent,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './pipeline-edit.component.html',
  styleUrl: './pipeline-edit.component.css',
})
export class PipelineEditComponent {
  backendService = inject(BackendService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  messageService = inject(MessageService);

  pipeid = '';
  pipelineJson: string = '';
  loading: boolean = false;

  constructor() {
    this.pipeid = this.route.snapshot.params['pipeid'];
    this.backendService.pipelineGet(this.pipeid).subscribe((resp) => {
      this.pipelineJson = JSON.stringify(resp, null, 2);
    });
  }

  onUpdatePipeline() {
    this.backendService.pipelineEdit(this.pipeid, this.pipelineJson).subscribe(
      () => {
        this.handleMessage('success', 'Pipeline edited successfully!', false);
      },
      (error) => {
        const errorMessage = error?.error.split('\n').pop();
        this.handleMessage('error', errorMessage, true);
      },
    );
  }

  handleMessage(
    severity: 'success' | 'error',
    detail: string,
    sticky: boolean,
  ) {
    if (severity === 'success') {
      this.messageService.add({ severity, detail });
      this.loading = true;
      setTimeout(() => {
        this.clear();
      }, 3000);
    } else if (severity === 'error') {
      this.messageService.add({ severity, detail, sticky: true });
    }
  }

  clear() {
    this.messageService.clear();
    this.router.navigateByUrl(`pipelines/pipeline-detail/${this.pipeid}`);
  }
}
