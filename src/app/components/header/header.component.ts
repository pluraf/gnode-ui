import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';

import { DatetimeService } from '../../services/datetime.service';
import { InfoService } from '../../services/info.service';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, DialogModule, ButtonModule, CommonModule],
  providers: [DatetimeService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  visible: boolean = false;
  position: string = 'top-right';
  displayUsername: string | null = null;
  userInitial: string | null = null;
  apiVersion: string = '';
  serialNumber: string = '';
  apimode: string = '';

  infoService = inject(InfoService);
  datetimeService = inject(DatetimeService);
  router = inject(Router);
  authService = inject(AuthService);
  settingsService = inject(SettingsService);

  isAuthentication: boolean = true;

  constructor() {
    effect(() => {
      const info = this.infoService.infoData();
      this.isAuthentication = !info.anonymous;
      this.apiVersion = info.version;
      this.serialNumber = info.serial_number;
      this.apimode = info.mode;
    });
  }

  ngOnInit(): void {
    const userInfo = this.authService.getLoggedinUser();
    if (userInfo) {
      this.userInitial = userInfo.sub.slice(0, 1).toUpperCase();
      this.displayUsername = userInfo.sub;
    }
  }

  showDialog(position: string) {
    this.position = position;
    this.visible = !this.visible;
  }

  onSignOut() {
    this.authService.logout();
    this.visible = false;
  }

  displayDateTime() {
    const dateTime = this.datetimeService.timeSettingSignal();
    if (dateTime.getFullYear() !== 1970) {
      return DateTime.fromJSDate(
        dateTime, {zone: this.settingsService.settingsdata().time.timezone}
      )
      .toFormat('yyyy-MM-dd HH:mm');
    }
    return "";
  }
}
