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
  backendSerice = inject(BackendService);
  route: ActivatedRoute = inject(ActivatedRoute);

  pipeid = '';
  pipelineJson: string = "";

  constructor() {
    this.pipeid = this.route.snapshot.params['pipeid'];
    this.backendSerice.pipelineGet(this.pipeid).subscribe((resp) => {
      this.pipelineJson = JSON.stringify(resp, null, 2);
    });
  }

  onUpdatePipeline() {
    this.backendSerice.pipelineEdit(this.pipeid, this.pipelineJson).subscribe((resp) => ({
    }));
  }
}
