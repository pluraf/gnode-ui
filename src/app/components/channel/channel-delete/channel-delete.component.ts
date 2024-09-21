import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-channel-delete',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule],
  templateUrl: './channel-delete.component.html',
  styleUrl: './channel-delete.component.css',
})
export class ChannelDeleteComponent {
  @Input() visible: boolean = false;
  @Input() channels: any[] = [];
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {}

  get isMultiple(): boolean {
    return this.channels.length > 1;
  }

  get channelIds(): string[] {
    return this.channels.map((channel) => channel.id);
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
