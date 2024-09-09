import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MqttBrokerServiceService } from '../../services/mqtt-broker-service.service';

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

  constructor() {}
}
