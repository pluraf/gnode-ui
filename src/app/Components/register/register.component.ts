import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, FormsModule, InputTextModule, ButtonModule, RippleModule, DividerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  value: string | undefined;

  loginObj: any = {
    "email": "",
    "username": "",
    "password": ""
  }
  http = inject(HttpClient);

  onRegistor() {
    debugger;
    this.http.post("api/users/", this.loginObj).subscribe((res: any) => {
      debugger;
      alert("register success!")
    })
  }
}
