import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

import { ApiService } from '../../../services/api.service';
import { NoteService } from '../../../services/note.service';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { MessageService } from 'primeng/api';

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
    ToastModule,
  ],
  providers: [ MessageService, NoteService ],
  templateUrl: './pipeline-create.component.html',
  styleUrl: './pipeline-create.component.css',
})
export class PipelineCreateComponent implements OnInit {
  apiService = inject(ApiService);
  route: ActivatedRoute = inject(ActivatedRoute);
  http = inject(HttpClient);
  noteService = inject(NoteService);
  messageService = inject(MessageService);

  pipeid = '';
  pipelineJson: string = '';
  pipelineConfig: any = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.http.get('/assets/pipelineConfig.json').subscribe((data) => {
      this.pipelineConfig = data;
    });
  }

  onCreatePipeline() {
    let pipelineData;
    try {
      pipelineData = JSON.parse(this.pipelineJson);
    } catch (error) {
      pipelineData = this.pipelineJson;
    }
    this.apiService.pipelineCreate(this.pipeid, pipelineData).subscribe(
      () => {
        this.noteService.handleMessage(
          this.messageService, 'success', 'Pipeline edited successfully!'
        );
      },
      (error) => {
        const errorMessage =
          error?.message ||
          (typeof error?.error === 'string' && error.error) ||
          (error?.status &&
            error?.statusText &&
            `${error.status}: ${error.statusText}`) ||
          (error?.status && `Error Code: ${error.status}`) ||
          'An unknown error occurred';

        this.noteService.handleMessage(
          this.messageService, 'error', errorMessage
        );
      },
    );
  }

  onGenerateConfig() {
    this.pipelineJson = JSON.stringify(this.pipelineConfig, null, 2);
  }
}
