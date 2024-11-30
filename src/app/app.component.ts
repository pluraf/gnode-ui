import {
  Component,
  inject,
  OnInit,
  effect,
} from '@angular/core';
import {
  RouterOutlet,
  Router,
  ActivatedRoute,
  NavigationEnd, NavigationStart, NavigationError,
} from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { SplitterModule } from 'primeng/splitter';
import { HttpClient } from '@angular/common/http';
import { InfoService } from './services/info.service';
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
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  http = inject(HttpClient);
  authService = inject(AuthService);
  infoService = inject(InfoService);

  margin_left: string;
  isVirtualMode: boolean = false;
  isAuthentication: boolean = true;
  isInfoLoaded: boolean = false;

  constructor() {
    this.margin_left = window.location.pathname == '/login' ? '0px' : '210px';

    effect(() => {
      const gnodeInfo = this.infoService.infoData();

      if (gnodeInfo.mode) {
        this.isInfoLoaded = true;
        this.isVirtualMode = gnodeInfo.mode == 'virtual';
        this.isAuthentication = ! gnodeInfo.anonymous;
        this.updateMenuItems();
      } else {
        this.isInfoLoaded = false;
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.margin_left =
          event.urlAfterRedirects == '/login' ? '0px' : '210px';
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
        { label: 'G-Cloud', routerLink: '/settings/gcloud' },
        { label: 'Time', routerLink: '/settings/gtime' },
        { label: 'Network', routerLink: '/settings/network' },
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
