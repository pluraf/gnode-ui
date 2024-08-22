import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '../../shared/primeng-modules';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PRIMENG_MODULES],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent {
  userObj: any = {
    username: '',
    password: '',
    is_admin: false,
  };

  http = inject(HttpClient);
  constructor(
    private router: Router,
    public userService: UserService,
  ) {}

  onCreateUser() {
    const token = this.userService.getToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .post('api/users/', this.userObj, { headers })
        .subscribe((res: any) => {
          alert('User created successfully!');
          this.router.navigateByUrl('/device');
        });
    } else {
      alert('You are not authorized to create users.');
    }
  }
}
