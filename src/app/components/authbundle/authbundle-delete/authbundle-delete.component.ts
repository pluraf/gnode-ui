import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-authbundle-delete',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule],
  templateUrl: './authbundle-delete.component.html',
  styleUrl: './authbundle-delete.component.css',
})
export class AuthbundleDeleteComponent {
  @Input() visible: boolean = false;
  @Input() connid: any;
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {}

  get isMultiple(): boolean {
    return Array.isArray(this.connid) && this.connid.length > 1;
  }

  get connectorIds(): string[] {
    if (Array.isArray(this.connid)) {
      return this.connid.map((connector) => connector.clients);
    } else {
      return [this.connid];
    }
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
