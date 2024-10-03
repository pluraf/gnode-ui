import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pipeline-create',
  standalone: true,
  imports: [
    SubheaderComponent,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './pipeline-create.component.html',
  styleUrl: './pipeline-create.component.css',
})
export class PipelineCreateComponent {
  backendService = inject(BackendService);
  route: ActivatedRoute = inject(ActivatedRoute);

  pipeid = '';
  pipelineJson: string = '';

  messages: string = '';

  constructor(private router: Router) {}

  onCreatePipeline() {
    let pipelineData = JSON.parse(this.pipelineJson);
    this.backendService.pipelineCreate(this.pipeid, pipelineData).subscribe(
      (response: any) => {
        this.router.navigateByUrl('/pipelines');
      },
      (error: any) => {
        console.log('error from create:', error);
        const errorMessage = error?.error.split('\n').pop();
        this.showMessage(errorMessage);
      },
    );
  }

  showMessage(message: string) {
    this.messages = message;
  }
}
