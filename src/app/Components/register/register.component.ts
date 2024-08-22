import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '../../shared/primeng-modules';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PRIMENG_MODULES],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  loginObj: any = {
    email: '',
    username: '',
    password: '',
  };

  http = inject(HttpClient);

  onRegistor() {
    this.http.post('api/users/', this.loginObj).subscribe((res: any) => {
      alert('register success!');
    });
  }
}
