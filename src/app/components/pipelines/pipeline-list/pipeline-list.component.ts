import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { SubheaderComponent } from '../../subheader/subheader.component';

@Component({
  selector: 'app-pipeline-list',
  standalone: true,
  imports: [SubheaderComponent, TableModule, RouterModule],
  templateUrl: './pipeline-list.component.html',
  styleUrl: './pipeline-list.component.css',
})
export class PipelineListComponent {
  menubarItems: MenuItem[] = [
    {
      routerLink: '/pipeline-create',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create pipeline',
      },
      iconClass: 'pi pi-plus m-1',
    },
    {
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Delete pipeline',
      },
      iconClass: 'pi pi-trash m-1',
    },
  ];

  pipelineList = [
    {
      name: 'Pipeline1',
      key: 'Test',
    },
    {
      name: 'Pipeline2',
      key: 'Test',
    },
  ];
}
