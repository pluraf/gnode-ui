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
import { HttpClient } from '@angular/common/http';

import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { SplitterModule } from 'primeng/splitter';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';

import { HeaderComponent } from './components/header/header.component';
import { ExternalComponent } from './components/external/external.component';
import { InfoService } from './services/info.service';
import { AuthService } from './services/auth.service';
import { SpinnerService } from './services/spinner.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    ExternalComponent,
    RouterOutlet,
    PanelMenuModule,
    SplitterModule,
    DividerModule,
    SidebarModule,
    ProgressSpinnerModule,
    FontAwesomeModule,
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
  spinnerService = inject(SpinnerService);
  faLibrary = inject(FaIconLibrary);

  margin_left: string;
  isVirtualMode: boolean = false;
  isAuthentication: boolean = true;
  isInfoLoaded: boolean = false;

  constructor() {
    this.margin_left = window.location.pathname == '/login' ? '0px' : '210px';
    this.faLibrary.addIcons(faComment, faBan);

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
    { label: 'Pipelines', routerLink: '/pipelines', styleClass: 'gap-2' },
    {
      label: 'Security',
      items: [
        { label: 'Authbundles', routerLink: '/authbundles' },
        { label: 'Certificates', routerLink: '/ca' },
      ],
      styleClass: 'gap-2',
    },
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
    { label: 'Users', routerLink: '/users', styleClass: 'gap-4' },
    { label: 'Status', routerLink: '/status', styleClass: 'gap-2' },
    { label: 'ChirpStack', routerLink: '/external/chirpstack', styleClass: 'gap-2' },
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
