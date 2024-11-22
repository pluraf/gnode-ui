import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
  effect,
} from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
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
  currentDateTime: string = '';
  margin_left: string;

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  dateTimeService = inject(DatetimeService);
  cdr = inject(ChangeDetectorRef);
  settingsService = inject(SettingsService);
  http = inject(HttpClient);
  apiInfoService = inject(ApiinfoService);

  isVirtualMode: boolean = false;
  isAuthentication: boolean = true;

  apiInfoSignal = this.apiInfoService.apiInfoData;

  constructor() {
    this.margin_left = window.location.pathname == "/login" ? "0px" : "210px";

    effect(() => {
      const updatedDateTime = this.dateTimeService.settings().currentDateTime;
      this.currentDateTime = updatedDateTime;
    });

    effect(() => {
      const apiInfo = this.apiInfoSignal();

      if (apiInfo.mode) {
        if (apiInfo.mode === 'virtual') {
          this.isVirtualMode = true;
          this.updateMenuItems();
        }
      }
    });
  }

  ngOnInit() {
    this.settingsService.loadSettingsData().subscribe((resp) => {
      if (resp) {
        this.isAuthentication = resp.authentication == false;
        this.updateMenuItems();
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.margin_left = event.urlAfterRedirects == "/login" ? "0px" : "210px";
      }
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

  updateMenuItems() {
    const settingsMenu = this.items.find((item) => item.label === 'Settings');
    const users = this.items.find((item) => item.label === 'Users');
    if (settingsMenu && settingsMenu.items) {
      settingsMenu.items.forEach((item) => {
        if (
          item.label === 'G-Cloud' ||
          item.label === 'Network' ||
          item.label === 'Time'
        ) {
          item.visible = !this.isVirtualMode;
        }
      });
    }
    if (users) {
      users.visible = !this.isAuthentication;
    }
  }
}
