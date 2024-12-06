import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { InfoService } from '../../services/info.service';
import { SettingsService } from '../../services/settings.service';
import { NoteService } from '../../services/note.service';
import { EncryptionService } from '../../services/encryption.service';

export interface LoginUser {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService, NoteService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);
  authService = inject(AuthService);
  infoService = inject(InfoService);
  settingsService = inject(SettingsService);
  messageService = inject(MessageService);
  noteService = inject(NoteService);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  encryptionService = inject(EncryptionService);

  from: string;
  errorMessage = '';

  loginUser: LoginUser = {
    username: '',
    password: '',
  };

  constructor() {
    this.from = '/channels';
    const nav = this.router.getCurrentNavigation();
    if (nav) {
      const state = nav.extras.state;
      if (state) {
        this.from = state['from'] || this.from;
      }
    }

    if (
      this.authService.isLoggedIn() ||
      this.infoService.infoData().anonymous
    ) {
      this.router.navigate([this.from]);
    }
  }

  async onLogin() {
    if (!this.loginUser.username || !this.loginUser.password) {
      this.noteService.handleMessage(
        this.messageService,
        'error',
        'Username and password are required.',
      );
      return;
    }

    ///////// encrypting user credential //////////
    const encryptedUsername = await this.encryptionService.encrypt(
      this.loginUser.username,
    );
    const encryptedPassword = await this.encryptionService.encrypt(
      this.loginUser.password,
    );

    const encryptedUserDetails = encryptedUsername + encryptedPassword;
    //////////////////////////////////////////////

    this.apiService
      .getAuthToken(this.loginUser.username, this.loginUser.password)
      .subscribe(
        (res: any) => {
          if (res.access_token) {
            this.authService.storeToken(res.access_token);
            this.router.navigate([this.from]);
            this.settingsService.load();
          } else {
            this.noteService.handleMessage(
              this.messageService,
              'error',
              res.error,
            );
          }
        },
        (error) => {
          if (error.status >= 400 && error.status < 500) {
            this.errorMessage = error.error?.detail?.msg || error.message;
          } else if (error.status >= 500) {
            this.errorMessage = error.error?.detail?.msg || error.message;
          } else if (error.message) {
            this.errorMessage = error.message;
          }
          this.noteService.handleMessage(
            this.messageService,
            'error',
            this.errorMessage,
          );
        },
      );
  }
}
