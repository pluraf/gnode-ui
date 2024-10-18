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
import moment from 'moment';

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

  currentDateTime: string = '';
  currentTimeZone: string = 'Europe/Stockholm';
  intervalId: any;

  constructor() {}

  ngOnInit() {
    this.updateRealTimeClock();
    this.startRealTimeClock();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startRealTimeClock(): void {
    this.intervalId = setInterval(() => {
      this.updateRealTimeClock();
    }, 1000);
  }

  updateRealTimeClock(): void {
    const currentTime = moment().tz(this.currentTimeZone).format('lll');
    this.currentDateTime = currentTime;
  }

  updateDateTime({
    dateTime,
    timeZone,
  }: {
    dateTime: string;
    timeZone: string;
  }): void {
    this.currentDateTime = dateTime;
    this.currentTimeZone = timeZone;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.startRealTimeClock();
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
    { label: 'Status', routerLink: '/status', styleClass: 'gap-2' },
  ];
}
