import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';

export interface ITableColumn {
  fieldName: string;
  headerName: string;
  enabled?: boolean;
  routePage?: any;
  isAdmin?: (row: any) => string;
}

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [PaginatorModule, TableModule, FontAwesomeModule, RouterModule],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.css',
})
export class ReusableTableComponent {
  @Input() columnArray: ITableColumn[] = [];
  @Input() gridData: any[] = [];

  @Input() paginator: boolean = true;
  @Input() rows: number = 15;
  @Input() rowsPerPageOptions: number[] = [10, 15, 30];
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  @Output() onRoute = new EventEmitter<any>();

  selectedItems: any[] = [];

  onSelectionChange() {
    this.selectionChange.emit(this.selectedItems);
  }
}
