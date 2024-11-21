import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';

import { MBrokerCService } from '../../../services/mbrokerc.service';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    CommonModule,
    FormsModule,
    PasswordModule,
    RouterModule,
    SubheaderComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.css',
})
export class ChannelCreateComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  brokerService = inject(MBrokerCService);
  messageService = inject(MessageService);

  value!: string;
  selectedCategory: any = null;
  communication: string = 'Allow';
  chanid = '';
  clientid = '';
  username = '';
  password = '';
  authtype = '';
  jwtKey: string = '';
  loading: boolean = false;

  categories: any[] = [
    { name: 'Enabled', key: 'A' },
    { name: 'Disabled', key: 'B' },
  ];

  selectedOption: string = 'jwt_es256';

  authOptions = [
    { value: 'jwt_es256', label: 'JWT_ES256' },
    { value: 'password', label: 'Username & Password' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.selectedCategory = this.categories[0];
  }

  onChangeAuthenticationType(even: any) {
    this.password = "";
  }

  onSubmit() {
    const selectedOptionObj = this.authOptions.find(
      (option) => option.value === this.selectedOption,
    );
    this.authtype = selectedOptionObj ? selectedOptionObj.value : '';

    const disabled = this.selectedCategory.name === 'Allow';

    let payload: any = {
      chanid: this.chanid,
      authtype: this.authtype,
      password: this.password,
      disabled: disabled,
    };
    if (this.username !== '') {
      payload.username = this.username;
    }
    if (this.clientid !== '') {
      payload.clientid = this.clientid;
    }
    this.brokerService.createChannel(payload).subscribe(
      (response: any) => {
        this.handleMessage('success', 'Channel created successfully', false);
      },
      (error: any) => {
        const errorMessage =
          error?.message ||
          (typeof error?.error === 'string' && error.error) ||
          (error?.status &&
            error?.statusText &&
            `${error.status}: ${error.statusText}`) ||
          (error?.status && `Error Code: ${error.status}`) ||
          'An unknown error occurred';
        this.handleMessage('error', errorMessage, true);
      },
    );
  }

  handleMessage(
    severity: 'success' | 'error',
    detail: string,
    sticky: boolean,
  ) {
    if (severity === 'success') {
      this.messageService.add({ severity, detail });
      this.loading = true;
      setTimeout(() => {
        this.clear();
      }, 3000);
    } else if (severity === 'error') {
      this.messageService.add({ severity, detail, sticky: true });
    }
  }

  clear() {
    this.messageService.clear();
    this.router.navigateByUrl('/channels');
  }
}
