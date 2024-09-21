import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, Location } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-subheader',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
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
  @Input() showBackArrow: boolean = false;

  constructor(private location: Location) {}
  goBack() {
    this.location.back();
  }
}
