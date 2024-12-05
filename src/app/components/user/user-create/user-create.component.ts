import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { ApiService } from '../../../services/api.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { NoteService } from '../../../services/note.service';
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
  ],
  providers: [MessageService, NoteService],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css',
})
export class UserCreateComponent {
  http = inject(HttpClient);
  authService = inject(AuthService);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  userObj: any = {
    username: '',
    password: '',
    is_admin: false,
  };

  constructor() {}

  onCreateUser() {
    if (!this.userObj.username || !this.userObj.password) {
      this.noteService.handleMessage(
        this.messageService,
        'warn',
        'Username and Password are required.',
      );
      return;
    }

    const token = this.authService.getToken();
    if (token) {
      this.userObj.token = token;

      this.apiService.createUser(this.userObj).subscribe({
        next: (response: any) => {
          if (response?.responses?.[0]?.error) {
            this.noteService.handleMessage(
              this.messageService,
              'error',
              response.responses[0].error,
            );
          } else {
            this.noteService.handleMessage(
              this.messageService,
              'success',
              'User created successfully!',
            );
          }
        },
        error: (error: any) => {
          if (
            error.status === 400 ||
            error.status === 401 ||
            error.status === 500
          ) {
            this.noteService.handleMessage(
              this.messageService,
              'error',
              'User name already exists.',
            );
          }
        }
      });
    }
  }
}
