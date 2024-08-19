import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { PRIMENG_MODULES } from '../../shared/primeng-modules';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PRIMENG_MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private apiUrl = environment.apiUrl + 'auth/token/';
  loginObj: any = {
    username: '',
    password: '',
  };
  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  http = inject(HttpClient);

  onLogin() {
    if (this.loginObj.username && this.loginObj.password) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      const body = new HttpParams()
        .set('username', this.loginObj.username)
        .set('password', this.loginObj.password);
      this.http
        .post('api/auth/token/', body, { headers })
        .subscribe((res: any) => {
          if (res.access_token) {
            this.userService.login(res.access_token);
            alert('Login successful!');
            this.router.navigateByUrl('/device');
          } else {
            alert('Invalid Username or Password.');
          }
        });
    }
  }
}
