import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { PRIMENG_MODULES } from '../../shared/primeng-modules';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PRIMENG_MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj: any = {
    username: 'admin',
    password: 'admin1234',
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
        .post('api/auth/token/', body.toString(), { headers })
        .subscribe((res: any) => {
          if (res.access_token) {
            this.userService.login(res.access_token);

            const user = this.userService.parseJwt(res.access_token);

            if (user.is_admin) {
              this.userService.setAdminStatus(true);
            }
            this.router.navigateByUrl('/device');
          } else {
            alert('Invalid Username or Password.');
          }
        });
    }
  }
}
