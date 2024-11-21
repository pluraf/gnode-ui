import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  errorMessage: string = '';
  from: string;

  loginUser: LoginUser = {
    username: '',
    password: '',
  };

  router = inject(Router);
  authService = inject(AuthService);

  constructor() {
    this.from = "/channels";
    const nav = this.router.getCurrentNavigation();
    if(nav){
      const state = nav.extras.state;
      if(state){
        this.from = state['from'] || this.from;
      }
    }
  }

  http = inject(HttpClient);
  apiService = inject(ApiService);

  onLogin() {
    if (!this.loginUser.username || !this.loginUser.password) {
      this.showErrorMessage('Username and password are required.');
      return;
    }

    this.apiService
      .getAuthToken(this.loginUser.username, this.loginUser.password)
      .subscribe(
        (res: any) => {
          if (res.access_token) {
            this.authService.storeToken(res.access_token);
            this.router.navigate([this.from]);
          } else {
            this.showErrorMessage('Invalid token');
          }
        },
        (error) => {
          if (error.error && error.error.detail) {
            this.showErrorMessage(error.error.detail);
          } else if (error.message) {
            this.showErrorMessage(error.message);
          } else {
            this.showErrorMessage('An unknown error occurred.');
          }
        },
      );
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
