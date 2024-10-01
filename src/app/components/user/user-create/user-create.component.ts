import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { UserService } from '../../../services/user.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SubheaderComponent } from '../../subheader/subheader.component';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SubheaderComponent,
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css',
})
export class UserCreateComponent {
  userObj: any = {
    username: '',
    password: '',
    is_admin: false,
  };

  errorMessage: string = '';
  successMessage: string = '';

  http = inject(HttpClient);

  constructor(
    private router: Router,
    public userService: UserService,
  ) {}

  onCreateUser() {
    if (!this.userObj.username || !this.userObj.password) {
      this.showErrorMessage('Username and Password are required.');
      return;
    }

    const token = this.userService.getToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.post('api/user/', this.userObj, { headers }).subscribe(
        (response: any) => {
          if (response?.responses?.[0]?.error) {
            this.showMessage(response.responses[0].error);
          }
          this.showMessage('User created successfully!');
          setTimeout(() => {
            this.router.navigateByUrl('/users');
          }, 1000);
        },
        (error) => {
          console.error('Error creating user:', error);
          if (error.status === 401) {
            this.showErrorMessage('User name already exists.');
          } else if (error.status === 500) {
            this.showErrorMessage('User name already exists.');
          }
        },
      );
    } else {
      this.showErrorMessage('Authorization token is required.');
    }
  }

  showMessage(message: string) {
    this.successMessage = message;
  }
  showErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
