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
  @Input() chanid: any;
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {}

  get isMultiple(): boolean {
    return Array.isArray(this.chanid) && this.chanid.length > 1;
  }

  get channelIds(): string[] {
    if (Array.isArray(this.chanid)) {
      return this.chanid.map((channel) => channel.clients);
    } else {
      return [this.chanid];
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
