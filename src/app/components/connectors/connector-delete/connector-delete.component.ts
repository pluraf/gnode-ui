import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-connector-delete',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule],
  templateUrl: './connector-delete.component.html',
  styleUrl: './connector-delete.component.css',
})
export class ConnectorDeleteComponent {
  @Input() visible: boolean = false;
  @Input() connid: any[] = [];
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {}

  get isMultiple(): boolean {
    return this.connid.length > 1;
  }

  get connectorIds(): string[] {
    return this.connid.map((connector) => connector.clients);
  }

  onDelete() {
    this.deleteConfirmed.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
