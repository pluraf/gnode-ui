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

  loginUser: LoginUser = {
    username: 'admin',
    password: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  http = inject(HttpClient);
  apiService = inject(ApiService);

  onLogin() {
    if (this.loginUser) {
      this.apiService
        .getAuthToken(this.loginUser.username, this.loginUser.password)
        .subscribe(
          (res: any) => {
            if (res.access_token) {
              this.authService.storeToken(res.access_token);
              this.router.navigateByUrl('/channels');
            } else {
              this.showErrorMessage(res.error);
            }
          },
          (error) => {
            if (error.error && error.error.detail) {
              this.showErrorMessage(error.error.detail);
            } else if (error.message) {
              this.showErrorMessage(error.message);
            }
          },
        );
    } else {
      this.showErrorMessage('Username and Password are required.');
    }
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
