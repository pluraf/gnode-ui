import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SubheaderComponent } from '../../subheader/subheader.component';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

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
  obj = {
    name: 'John',
    city: 'Chicago',
  };

  objJson: string;

  constructor() {
    this.objJson = JSON.stringify(this.obj);
  }
  onCreatePipeline() {}
}
