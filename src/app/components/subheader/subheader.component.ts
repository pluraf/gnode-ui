import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
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
  ],
  templateUrl: './subheader.component.html',
  styleUrl: './subheader.component.css',
})
export class SubheaderComponent {
  @Input() selectedMenuName: string = '';
  @Input() items: MenuItem[] = [];
  constructor(private router: Router) {}

  addConnector() {}

  delete() {}

  editConnector() {}
}
