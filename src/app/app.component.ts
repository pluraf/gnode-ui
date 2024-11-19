import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { SplitterModule } from 'primeng/splitter';
import { DatetimeService } from './services/datetime.service';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './services/settings.service';
import { ApiinfoService } from './services/apiinfo.service';
import { ApiInfo } from './services/service';

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
  settingsService = inject(SettingsService);
  http = inject(HttpClient);
  apiInfoService = inject(ApiinfoService);

  isVirtualMode: boolean = false;
  isAuthentication: boolean = true;

  apiInfo: ApiInfo | null = null;

  constructor() {}

  ngOnInit() {
    this.dateTimeService.currentDateTime$.subscribe((dateTime) => {
      this.currentDateTime = dateTime;
      this.cdr.detectChanges();
    });

    this.settingsService.loadSettingsData().subscribe((resp) => {
      if (resp) {
        this.isAuthentication = resp.authentication == false;
        this.updateMenuItems();
      }
    });

    this.apiInfoService.loadApiInfo().subscribe((apiInfo) => {
      this.apiInfo = apiInfo;
      this.isVirtualMode = apiInfo.mode === 'virtual';
      this.updateMenuItems();
    });
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
        { label: 'Authentication', routerLink: '/settings/authentication' },
      ],
      styleClass: 'gap-2',
    },
    { label: 'Status', routerLink: '/status', styleClass: 'gap-2' },
  ];

  updateMenuItems(isUsersVisible: boolean = true) {
    const settingsMenu = this.items.find((item) => item.label === 'Settings');
    const users = this.items.find((item) => item.label === 'Users');
    if (settingsMenu && settingsMenu.items) {
      settingsMenu.items.forEach((item) => {
        if (
          item.label === 'G-Cloud' ||
          item.label === 'Network' ||
          item.label === 'Time'
        ) {
          item.visible = false;
        } else {
          item.visible = true;
        }
      });
    }
    if (users) {
      users.visible = !this.isAuthentication;
    }
  }
}
