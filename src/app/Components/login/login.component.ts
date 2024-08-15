import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DividerModule } from 'primeng/divider';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, FormsModule, InputTextModule, ButtonModule, RippleModule, DividerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  value: string | undefined;

  loginObj: any = {
    "username": "",
    "password": ""
  }
  constructor(
    private router: Router,
    private userService: UserService) { }
  http = inject(HttpClient);

  onLogin() {
    if (this.loginObj.username && this.loginObj.password) {
      const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
      const body = new HttpParams()
        .set('username', this.loginObj.username)
        .set('password', this.loginObj.password);
      this.http.post('api/auth/token/', body, { headers }).subscribe(
        (res: any) => {
          console.log('res', res);
          if (res.access_token) {
            /* sessionStorage.setItem('token', res.access_token); */
            this.userService.login(res.access_token);
            alert('Login successful!');
            this.router.navigateByUrl('/device')

          } else {
            alert('Invalid Username or Password.');
          }
        });
    }
  }

}
