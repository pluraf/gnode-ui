import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

import { DatetimeService } from '../../services/datetime.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, DialogModule, ButtonModule, CommonModule],
  providers: [SettingsService, ApiService, DatetimeService],
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

  apiService = inject(ApiService);
  datetimeService = inject(DatetimeService);
  router = inject(Router);
  authService = inject(AuthService);
  settingsService = inject(SettingsService);

  isAuthentication: boolean = true;
  settingsinfo = this.settingsService.settingsdata();

  constructor() {
    effect(() => {
      const authentication = this.settingsService.settingsdata().authentication;
      if (authentication === false) {
        this.isAuthentication = false;
      } else {
        this.isAuthentication = true;
      }
    });
  }

  ngOnInit(): void {
    const userInfo = this.authService.getLoggedinUser();
    if (userInfo) {
      this.userInitial = userInfo.sub.slice(0, 1).toUpperCase();
      this.displayUsername = userInfo.sub;
    }

    this.getApiMode();
  }

  getApiMode(): void {
    this.apiService.getApiInfo().subscribe({
      next: (response) => {
        this.apiVersion = response['version'];
        this.serialNumber = response['serial_number'];
        this.apimode = response['mode'];
      },
    });
  }

  showDialog(position: string) {
    this.position = position;
    this.visible = !this.visible;
  }

  onSignOut() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.visible = false;
  }
}
