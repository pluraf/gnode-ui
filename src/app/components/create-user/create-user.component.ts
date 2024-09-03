import { Component, inject, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent {
  userObj: any = {
    username: '',
    password: '',
    is_admin: false,
  };
  @Output() buttonClick = new EventEmitter<void>();

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
          this.router.navigateByUrl('/device');
        });
    } else {
      alert('You are not authorized to create users.');
    }
  }
}
