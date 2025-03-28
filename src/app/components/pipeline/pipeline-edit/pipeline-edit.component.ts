import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';

import { NoteService } from '../../../services/note.service';
import { ApiService } from '../../../services/api.service';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { PipelineAssemblerComponent } from '../assembler/assembler.component';

@Component({
  selector: 'app-pipeline-edit',
  standalone: true,
  imports: [
    SubheaderComponent,
    PipelineAssemblerComponent,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ToastModule,
    TabViewModule
  ],
  providers: [MessageService, NoteService],
  templateUrl: './pipeline-edit.component.html',
  styleUrl: './pipeline-edit.component.css',
})
export class PipelineEditComponent implements OnInit {
  apiService = inject(ApiService);
  route: ActivatedRoute = inject(ActivatedRoute);
  messageService = inject(MessageService);
  noteService = inject(NoteService);
  @ViewChild('pipelineAssembler') pipelineAssembler!: PipelineAssemblerComponent;

  pipeid = '';
  pipelineJson: string = '';
  private mode_ = 0;

  constructor() {
    this.pipeid = this.route.snapshot.params['pipeid'];
  }

  ngOnInit() {
    this.apiService.pipelineGet(this.pipeid).subscribe((resp) => {
      this.pipelineJson = JSON.stringify(resp, null, 2);
      this.pipelineAssembler.deserialize(this.pipelineJson);
    });
  }

  onModeChange(tabIndex: number) {
    this.mode_ = tabIndex;
    if (this.mode_ === 1) {
      this.pipelineJson = this.pipelineAssembler.serialize(true);
    } else if (this.mode_ === 0) {
      this.pipelineAssembler.deserialize(this.pipelineJson);
    }
  }

  onUpdatePipeline() {
    let config: string;
    if (this.mode_ === 0) {
      config = this.pipelineAssembler.serialize();
    } else {
      config = this.pipelineJson;
    }

    this.apiService.pipelineEdit(this.pipeid, config).subscribe(
      () => {
        this.noteService.handleMessage(
          this.messageService,
          'success',
          'Pipeline edited successfully!',
        );
      },
      (error) => {
        const errorMessage = error?.error.split('\n').pop();
        this.noteService.handleMessage(
          this.messageService,
          'error',
          errorMessage,
        );
      },
    );
  }
}
