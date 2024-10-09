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
  ],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.css',
})
export class ChannelCreateComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  brokerService = inject(MBrokerCService);
  value!: string;
  selectedCategory: any = null;
  communication: string = 'Allow';
  chanid = '';
  clientid = '';
  username = '';
  password = '';
  authtype = '';
  jwtKey: string = '';
  messages: string = '';

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
    this.brokerService.createChannel(payload).subscribe((response: any) => {
      if (response.responses[0].hasOwnProperty('error')) {
        this.showMessage(response.responses[0].error)!;
      } else {
        this.router.navigateByUrl('/channels');
      }
    });
  }

  showMessage(message: string) {
    this.messages = message;
  }

  previousPage() {
    this.router.navigateByUrl('/channels');
  }
}
