import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { SubheaderComponent } from '../../subheader/subheader.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SubheaderComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  menubarItems: MenuItem[] = [
    {
      routerLink: '/user-create',
      tooltipOptions: {tooltipEvent: 'hover', tooltipPosition: 'bottom', tooltipLabel: 'Create user'},
      iconClass: 'pi pi-plus m-3'
    },
    {
      routerLink: '/user-edit',
      tooltipOptions: {tooltipEvent: 'hover', tooltipPosition: 'bottom', tooltipLabel: 'Edit user'},
      iconClass: 'pi pi-pencil m-3'
    },
    {
      routerLink: '/user-delete',
      tooltipOptions: {tooltipEvent: 'hover', tooltipPosition: 'bottom', tooltipLabel: 'Delete user'},
      iconClass: 'pi pi-trash m-3'
    }
  ];

}
