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
import { ChannelData } from '../channel';

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
  chanid: string = '';
  clientid: string = '';
  username: string = '';
  password: string = '';
  authtype: string = '';
  jwtKey: string = '';
  loading: boolean = false;

  categories: { name: string; key: string }[] = [
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

  onChangeAuthenticationType(event: any) {
    this.password = '';
  }

  onSubmit() {
    const selectedOptionObj = this.authOptions.find(
      (option) => option.value === this.selectedOption,
    );
    this.authtype = selectedOptionObj ? selectedOptionObj.value : '';

    const disabled = this.selectedCategory.name === 'Allow';

    const payload: Partial<ChannelData> = {
      chanid: this.chanid,
      authtype: this.authtype,
      password: this.password,
      disabled: disabled,
      username: this.username || undefined,
      clientid: this.clientid || undefined,
    };

    // Validation: Check for blank fields in the payload
    const emptyFields = Object.entries(payload).filter(
      ([key, value]) => value === undefined || value === '',
    );
    if (emptyFields.length > 0) {
      const missingFields = emptyFields.map(([key]) => key).join(', ');
      this.handleMessage(
        'error',
        `The following fields are missing or empty: ${missingFields}`,
        true,
      );
      return;
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

  handleMessage(type: 'success' | 'error', message: string, sticky: boolean) {
    this.messageService.add({
      severity: type,
      summary: type,
      detail: message,
      sticky,
    });
  }
  clear() {
    this.messageService.clear();
    this.router.navigateByUrl('/channels');
  }
}
