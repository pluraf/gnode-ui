import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

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
    TooltipModule,
  ],
  templateUrl: './pipeline-create.component.html',
  styleUrl: './pipeline-create.component.css',
})
export class PipelineCreateComponent implements OnInit {
  backendService = inject(BackendService);
  route: ActivatedRoute = inject(ActivatedRoute);
  http = inject(HttpClient);

  pipeid = '';
  pipelineJson: string = '';
  messages: string = '';
  pipelineConfig: any = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.http.get('/assets/pipelineConfig.json').subscribe((data) => {
      this.pipelineConfig = data;
    });
  }

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
    this.pipelineJson = JSON.stringify(this.pipelineConfig, null, 2);
  }
}
