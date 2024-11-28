import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
  effect,
} from '@angular/core';
import {
  RouterOutlet,
  Router,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { SplitterModule } from 'primeng/splitter';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './services/settings.service';
import { ApiinfoService } from './services/apiinfo.service';
import { ApiInfo } from './services/service';
import { AuthService } from './services/auth.service';

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
  providers: [Router, SettingsService, AuthService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  margin_left: string;

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);
  settingsService = inject(SettingsService);
  http = inject(HttpClient);
  apiInfoService = inject(ApiinfoService);
  authService = inject(AuthService);

  isVirtualMode: boolean = false;
  isAuthentication: boolean = true;

  apiInfoSignal = this.apiInfoService.apiInfoData;
  settingInfo = this.settingsService.settingsdata;

  constructor() {
    this.margin_left = window.location.pathname == '/login' ? '0px' : '210px';

    effect(() => {
      const apiInfo = this.apiInfoSignal();

      if (apiInfo.mode) {
        if (apiInfo.mode === 'virtual') {
          this.isVirtualMode = true;
          this.updateMenuItems();
        }
      }
    });

    effect(() => {
      const authentication = this.settingInfo().authentication;
      this.isAuthentication = authentication;
      this.updateMenuItems();
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.margin_left =
          event.urlAfterRedirects == '/login' ? '0px' : '210px';
      }
    });

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
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
    const updatedItems = this.items.map((item) => {
      if (item.label === 'Users') {
        item.visible = this.isAuthentication;
      } else if (item.label === 'Settings' && item.items) {
        item.items.forEach((subItem) => {
          if (
            subItem.label === 'G-Cloud' ||
            subItem.label === 'Network' ||
            subItem.label === 'Time'
          ) {
            subItem.visible = !this.isVirtualMode;
          }
        });
      }
      return item;
    });
    this.items = updatedItems;
  }
}
