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
  @Input() authbundles: any[] = [];
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {}

  get isMultiple(): boolean {
    return Array.isArray(this.authbundles) && this.authbundles.length > 1;
  }

  get authbundleIds(): string[] {
    if (Array.isArray(this.authbundles)) {
      return this.authbundles.map((authbundleid) => authbundleid.authbundle_id);
    } else {
      return [this.authbundles];
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
