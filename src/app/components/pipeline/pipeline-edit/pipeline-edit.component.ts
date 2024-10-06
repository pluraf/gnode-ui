import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';

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
  ],
  templateUrl: './pipeline-edit.component.html',
  styleUrl: './pipeline-edit.component.css',
})
export class PipelineEditComponent {
  backendService = inject(BackendService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  pipeid = '';
  pipelineJson: string = '';
  messages: string = '';

  constructor() {
    this.pipeid = this.route.snapshot.params['pipeid'];
    this.backendService.pipelineGet(this.pipeid).subscribe((resp) => {
      this.pipelineJson = JSON.stringify(resp, null, 2);
    });
  }

  onUpdatePipeline() {
    this.backendService.pipelineEdit(this.pipeid, this.pipelineJson).subscribe(
      (response: any) => {
        this.router.navigateByUrl(`pipeline-detail/${this.pipeid}`);
      },
      (error: any) => {
        const errorMessage = error?.error.split('\n').pop();
        this.showMessage(errorMessage);
      },
    );
  }

  showMessage(message: string) {
    this.messages = message;
  }
}
