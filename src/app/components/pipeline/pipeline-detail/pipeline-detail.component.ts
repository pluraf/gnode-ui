import { Component, inject } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pipeline-detail',
  standalone: true,
  imports: [],
  templateUrl: './pipeline-detail.component.html',
  styleUrl: './pipeline-detail.component.css',
})
export class PipelineDetailComponent {
  constructor() {}

  showDialog() {}

  onDeletePipelines() {}
}
