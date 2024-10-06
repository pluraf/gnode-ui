import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';

import * as pipelineConfig from '../pipelineConfig.json';
@Component({
  selector: 'app-pipeline-create',
  standalone: true,
  imports: [
    SubheaderComponent,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    CheckboxModule,
  ],
  templateUrl: './pipeline-create.component.html',
  styleUrl: './pipeline-create.component.css',
})
export class PipelineCreateComponent {
  backendService = inject(BackendService);
  route: ActivatedRoute = inject(ActivatedRoute);
  http = inject(HttpClient);

  pipeid = '';
  pipelineJson: string = '';
  messages: string = '';
  isConfigGenerated: boolean = false;

  constructor(private router: Router) {}

  onCreatePipeline() {
    let pipelineData = JSON.parse(this.pipelineJson);
    this.backendService.pipelineCreate(this.pipeid, pipelineData).subscribe(
      (response: any) => {
        this.router.navigateByUrl('/pipelines');
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

  onGenerateConfig() {
    if (this.isConfigGenerated) {
      this.pipelineJson = JSON.stringify(pipelineConfig, null, 2);
    } else {
      this.pipelineJson = '';
    }
  }
}
