import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  ],
  templateUrl: './pipeline-edit.component.html',
  styleUrl: './pipeline-edit.component.css',
})
export class PipelineEditComponent {
  obj = {
    name: 'Pipeline1',
    pipelineJson: 'pipelineJson',
  };

  objJson: string;

  constructor() {
    this.objJson = JSON.stringify(this.obj);
  }

  updateObj() {
    const tempObj = JSON.parse(this.objJson);
    this.obj.name = tempObj.name;
    this.obj.pipelineJson = tempObj.pipelineJson;
    console.log('obj', this.obj);
  }
  onUpdatePipeline() {}
}
