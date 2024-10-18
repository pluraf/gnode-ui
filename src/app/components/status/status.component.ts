import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';

import { SubheaderComponent } from '../subheader/subheader.component';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    FormsModule,
    SubheaderComponent,
    TableModule,
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  statuslist: any[] = [
    {
      id: 1,
      name: 'Network Status',
      description: 'descr',
      status: 'Running/Stop',
    },
    {
      id: 2,
      name: 'G-Node cloud status',
      description: 'descr',
      status: 'Running/Stop',
    },
  ];
}
