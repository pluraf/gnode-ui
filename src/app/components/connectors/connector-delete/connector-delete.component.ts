import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-connector-delete',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './connector-delete.component.html',
  styleUrl: './connector-delete.component.css',
})
export class ConnectorDeleteComponent {
  @Input() visible: boolean = false;
  @Input() connid: string = '';
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  constructor() {}

  onDelete() {
    this.deleteConfirmed.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
