import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.css',
})
export class UserDeleteComponent {
  @Input() visible: boolean = false;
  @Input() users: any[] = [];
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {}

  get isMultiple(): boolean {
    return Array.isArray(this.users) && this.users.length > 1;
  }

  get userIds(): string[] {
    if (Array.isArray(this.users)) {
      return this.users.map((user) => user.username);
    } else {
      return [this.users];
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
