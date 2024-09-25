import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pipeline-delete',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule],
  templateUrl: './pipeline-delete.component.html',
  styleUrl: './pipeline-delete.component.css',
})
export class PipelineDeleteComponent {
  @Input() visible: boolean = false;
  @Input() pipelines: any[] = [];
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {}

  get isMultiple(): boolean {
    return this.pipelines.length > 1;
  }

  get pipelineIds(): string[] {
    return this.pipelines.map((pipeid) => pipeid.id);
  }

  onDelete() {
    this.deleteConfirmed.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onClose() {
    this.cancel.emit();
  }
}
