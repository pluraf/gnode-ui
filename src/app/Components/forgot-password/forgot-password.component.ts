import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PRIMENG_MODULES } from '../../shared/primeng-modules';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PRIMENG_MODULES, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: string = '';
  private apiUrl = environment.apiUrl + 'users';

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  http = inject(HttpClient);

  get email() {
    return this.forgotPasswordForm.controls['email'];
  }
  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.http.post(this.apiUrl, { email }).subscribe({
        next: (response) => {
          this.message = 'A password reset link has been sent to your email.';
        },
        error: (error) => {
          this.message = 'An error occurred. Please try again.';
        },
      });
    }
  }
}
