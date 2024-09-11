import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

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
  loginUser: any = {
    username: 'admin',
    password: 'admin1234',
  };
  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  http = inject(HttpClient);

  onLogin() {
    if (this.loginUser.username && this.loginUser.password) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      const body = new HttpParams()
        .set('username', this.loginUser.username)
        .set('password', this.loginUser.password);
      this.http
        .post('api/auth/token/', body.toString(), { headers })
        .subscribe((res: any) => {
          if (res.access_token) {
            this.userService.login(res.access_token);
            this.router.navigateByUrl('/connectors');
          } else {
            alert('Invalid Username or Password.');
          }
        });
    }
  }
}
