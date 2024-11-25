import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

import { DatetimeService } from '../../services/datetime.service';
import { UserService } from '../../services/user.service';
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
  userInitial: string | null = null;
  visible: boolean = false;
  position: string = 'top-right';
  displayUsername: string | null = null;
  visibleTime: boolean = false;
  apiVersion: string = '';
  serialNumber: string = '';
  apimode: string = '';
  showusername: boolean = false;

  apiService = inject(ApiService);
  datetimeService = inject(DatetimeService);
  router = inject(Router);
  authService = inject(AuthService);
  userService = inject(UserService);
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

    let initialtime = this.datetimeService.timeSettings().formattedDateTime;
    console.log('initialtime', initialtime);
  }

  ngOnInit(): void {
    this.userService.getUsername();

    this.userService.users$.subscribe((users) => {
      if (users && users.length > 0) {
        const username = users[0]?.username;

        if (username && typeof username === 'string') {
          this.userInitial = username.charAt(0).toUpperCase();
          this.displayUsername =
            username.charAt(0).toUpperCase() + username.slice(1);
        } else {
          this.userInitial = null;
          this.displayUsername = null;
        }
      }
    });

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
