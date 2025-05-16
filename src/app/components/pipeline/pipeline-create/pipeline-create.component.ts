import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { TabViewModule } from 'primeng/tabview';

import { PipelineAssemblerComponent } from '../assembler/assembler.component';

@Component({
  selector: 'app-pipeline-create',
  standalone: true,
  imports: [
    SubheaderComponent,
    PipelineAssemblerComponent,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    CheckboxModule,
    TooltipModule,
    ToastModule,
    TabViewModule,
  ],
  templateUrl: './pipeline-create.component.html',
  styleUrl: './pipeline-create.component.css',
})
export class PipelineCreateComponent {
  apiService = inject(ApiService);
  route: ActivatedRoute = inject(ActivatedRoute);
  http = inject(HttpClient);
  noteService = inject(NoteService);

  @ViewChild('pipelineAssembler') pipelineAssembler!: PipelineAssemblerComponent;

  pipeid = '';
  pipelineJson: string = '';
  private mode_ = 0;

  onModeChange(tabIndex: number) {
    this.mode_ = tabIndex;
    if (this.mode_ === 1) {
      this.pipelineJson = this.pipelineAssembler.serialize(true);
    } else if (this.mode_ === 0) {
      this.pipelineAssembler.deserialize(this.pipelineJson);
    }
  }

  onCreatePipeline() {
    let config: string;
    if (this.mode_ === 0) {
      config = this.pipelineAssembler.serialize();
    } else {
      config = this.pipelineJson;
    }

    this.apiService.pipelineCreate(this.pipeid, config).subscribe({
      next: (response) => {
        this.noteService.handleMessage(
          response,'Pipeline created successfully!'
        );
      },
      error: (response) => {
        this.noteService.handleError(response);
      },
    });
  }
}
