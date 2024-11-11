import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

import { BackendService } from '../../services/backend.service';
import { DatetimeService } from '../../services/datetime.service';
import { UserService } from '../../services/user.service';
import moment from 'moment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, DialogModule, ButtonModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  userInitial: string | null = null;
  visible: boolean = false;
  position: string = 'top-right';
  displayUsername: string | null = null;
  visibleTime: boolean = false;
  apiVersion: any;
  serialNumber: string = '';
  currentDateTime: string = '';
  timerSubscription: Subscription | null = null;

  backendService = inject(BackendService);
  datetimeService = inject(DatetimeService);
  router = inject(Router);
  userService = inject(UserService);

  constructor() {}

  ngOnInit(): void {
    const username = this.userService.getUsername();
    this.userInitial = username ? username.charAt(0).toUpperCase() : null;
    this.displayUsername = username
      ? username.charAt(0).toUpperCase() + username.slice(1)
      : null;
    this.getApiVersion();

    this.timerSubscription = this.datetimeService.currentDateTime$.subscribe(
      (dateTime: string) => {
        this.currentDateTime = moment(dateTime).format('MMM DD, YYYY hh:mm A');
      },
    );
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  getApiVersion(): void {
    this.backendService.getApiVersion().subscribe({
      next: (response) => {
        this.apiVersion = response['api_version'];
        this.serialNumber = response['serial_number'];
      },
    });
  }

  showDialog(position: string) {
    this.position = position;
    this.visible = !this.visible;
  }

  onSignOut() {
    this.userService.logout();
    this.router.navigateByUrl('/login');
    this.visible = false;
  }
}
