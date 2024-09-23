import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { SubheaderComponent } from '../../subheader/subheader.component';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

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
  route: ActivatedRoute = inject(ActivatedRoute);

  pipeid = '';

  obj = {
    name: 'Pipeline1',
    pipelineJson: 'pipelineJson',
  };

  objJson: string = "";

  constructor() {
    this.pipeid = this.route.snapshot.params['chanid'];
    console.log(this.pipeid);
  }

  updateObj() {
  }

  onUpdatePipeline() {}
}
