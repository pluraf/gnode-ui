import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { SplitterModule } from 'primeng/splitter';
import { ChannelDetailComponent } from './components/channel/channel-detail/channel-detail.component';

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
  ],
  providers: [Router],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'gnode-ui';
  router: Router = inject(Router);
  items: MenuItem[] = [
    {label: 'Channels', routerLink: '/channels'},
    {
      label: 'Pipelines',
      items:[
        {label: 'List', routerLink: '/pipelines'},
        {label: 'Authentication', routerLink: '/authbundles'},
      ]
    },
    {label: 'Users', routerLink: '/users'},
    {label: 'Settings', routerLink: '/settings'},
  ];

  constructor() {}
}
