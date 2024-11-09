import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { SplitterModule } from 'primeng/splitter';
import { ChannelDetailComponent } from './components/channel/channel-detail/channel-detail.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DatetimeService } from './services/datetime.service';
import { BackendService } from './services/backend.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    PanelMenuModule,
    SplitterModule,
    DividerModule,
    SidebarModule,
    ChannelDetailComponent,
    SettingsComponent,
  ],
  providers: [Router],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'gnode-ui';
  currentDateTime: string = '';

  router: Router = inject(Router);
  dateTimeService = inject(DatetimeService);
  cdr = inject(ChangeDetectorRef);
  backendService = inject(BackendService);
  http = inject(HttpClient);

  isVirtualMode: boolean = false;

  constructor() {}

  ngOnInit() {
    this.dateTimeService.currentDateTime$.subscribe((dateTime) => {
      this.currentDateTime = dateTime;
      this.cdr.detectChanges();
      this.backendService.getApiInfo().subscribe((resp) => {
        if (resp) {
          this.isVirtualMode = resp.mode === 'virtual';
          this.updateMenuItems();
        }
      });
    });
    this.currentDateTime = new Date().toISOString();
  }

  items: MenuItem[] = [
    { label: 'Channels', routerLink: '/channels', styleClass: 'gap-2' },
    {
      label: 'Pipelines',
      items: [
        { label: 'List', routerLink: '/pipelines' },
        { label: 'Authbundles', routerLink: '/authbundles' },
      ],
      styleClass: 'gap-2',
    },
    { label: 'Users', routerLink: '/users', styleClass: 'gap-4' },
    {
      label: 'Settings',
      items: [
        { label: 'Channels', routerLink: '/settings' },
        { label: 'G-Cloud', routerLink: '/settings/g-cloud' },
        { label: 'Time', routerLink: '/settings/g-time' },
        { label: 'Network', routerLink: '/settings/network-settings' },
      ],
      styleClass: 'gap-2',
    },
    { label: 'Status', routerLink: '/status', styleClass: 'gap-2' },
  ];

  updateMenuItems() {
    const settingsMenu = this.items.find((item) => item.label === 'Settings');
    if (settingsMenu && settingsMenu.items) {
      settingsMenu.items.forEach((item) => {
        if (item.label === 'G-Cloud') {
          item.visible = !this.isVirtualMode;
        }
        if (item.label === 'Network Settings') {
          item.visible = !this.isVirtualMode;
        }
      });
    }
  }
}
