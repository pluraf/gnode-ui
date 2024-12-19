import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { NoteService } from '../../../services/note.service';
import { ApiService } from '../../../services/api.service';
import { SubheaderComponent } from '../../subheader/subheader.component';

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
  providers: [MessageService, NoteService],
  templateUrl: './pipeline-edit.component.html',
  styleUrl: './pipeline-edit.component.css',
})
export class PipelineEditComponent {
  apiService = inject(ApiService);
  route: ActivatedRoute = inject(ActivatedRoute);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  pipeid = '';
  pipelineJson: string = '';

  constructor() {
    this.pipeid = this.route.snapshot.params['pipeid'];
    this.apiService.pipelineGet(this.pipeid).subscribe((resp) => {
      this.pipelineJson = JSON.stringify(resp, null, 2);
    });
  }

  onUpdatePipeline() {
    this.apiService.pipelineEdit(this.pipeid, this.pipelineJson).subscribe(
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
