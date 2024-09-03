import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-subheader',
  standalone: true,
  imports: [
    RouterModule,
    MenubarModule,
    CommonModule,
    RippleModule,
    InputTextModule,
    AvatarModule,
    BadgeModule,
  ],
  templateUrl: './subheader.component.html',
  styleUrl: './subheader.component.css',
})
export class SubheaderComponent {
  selectedMenuName: string = 'Connectors';

  /*   items: MenuItem[] = [
    {
      icon: 'pi pi-plus',
      tooltip: '',
      tooltipPosition: 'bottom',
      routerLink: '/connector-create',
    },
    {
      icon: 'pi pi-pencil',
      tooltip: '',
      tooltipPosition: 'bottom',
      routerLink: '/connector-edit',
    },
    {
      icon: 'pi pi-trash',
      tooltip: '',
      tooltipPosition: 'bottom',
      routerLink: '/connector-delete',
    },
    {
      icon: 'pi pi-user',
      tooltip: '',
      tooltipPosition: 'bottom',
      routerLink: '/create-user',
    },
  ]; */
  constructor(private router: Router) {}

  addConnector() {}

  delete() {}

  editConnector() {}
}
