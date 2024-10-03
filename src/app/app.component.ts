import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
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

  router: Router = inject(Router);
  timeService = inject(DatetimeService);

  currentDateTime: string | undefined;

  constructor() {}

  ngOnInit() {
    this.currentDateTime = this.timeService.getCurrentTime('UTC');
  }

  updateDateTime(newDateTime: string): void {
    this.currentDateTime = newDateTime;
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
    { label: 'Settings', routerLink: '/settings', styleClass: 'gap-2' },
  ];
}
