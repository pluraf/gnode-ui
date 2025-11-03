import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteComponent implements OnChanges{
  @Input() visible: boolean = false;
  @Input() items: any[] = [];
  @Input() itemLabel: string = '';
  @Input() idField: string = 'id';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  visibleDialog: boolean = false;

  constructor() {}

  ngOnChanges(changes: any) {
    if (changes['visible']) {
      this.visibleDialog = changes['visible'].currentValue;
    }
  }

  get isMultiple(): boolean {
    return this.items.length > 1;
  }

  get itemIds(): string[] {
    return this.items.map((item) => item[this.idField]);
  }

  onDelete() {
    this.deleteConfirmed.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

}
