import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';

import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-connector-create',
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
  templateUrl: './connector-create.component.html',
  styleUrl: './connector-create.component.css',
})
export class ConnectorCreateComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  brokerService = inject(MqttBrokerServiceService);
  value!: string;
  selectedCategory: any = null;
  communication: string = 'Allow';
  connid = '';
  clientid = '';
  username = '';
  password = '';
  authtype = '';

  categories: any[] = [
    { name: 'Enabled', key: 'A' },
    { name: 'Disabled', key: 'B' },
  ];

  selectedOption: string = 'jwt';

  authOptions = [
    { value: 'jwt', label: 'JWT_ES256' },
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
    this.authtype = selectedOptionObj ? selectedOptionObj.label : '';

    const disabled = this.selectedCategory.name === 'Allow';

    let payload: any = {
      connid: this.connid,
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

    this.brokerService.createConnector(payload).subscribe((response) => {
      if (response.responses[0].hasOwnProperty('error')) {
        alert(response.responses[0].error);
      } else {
        this.router.navigateByUrl('/connectors');
      }
    });
  }
}
