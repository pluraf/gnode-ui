import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';

import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';

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
  ],
  templateUrl: './connector-create.component.html',
  styleUrl: './connector-create.component.css',
})
export class ConnectorCreateComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  brokerService = inject(MqttBrokerServiceService);

  value!: string;
  selectedCategory: any = null;
  selectedMethod: any = null;
  communication: string = 'Allow';
  showUserPassField = false;
  showPublicKeyField = false;

  connid = '';
  username = '';
  password = '';
  authtype = '';

  categories: any[] = [
    { name: 'Allow', key: 'A' },
    { name: 'Block', key: 'B' },
  ];

  ngOnInit() {
    this.selectedCategory = this.categories[0];
  }
  selectedOption: string = 'JWT_ES250';

  options = [
    { value: 'option1', label: 'JWT_ES250' },
    { value: 'option2', label: 'Username & Password' },
  ];

  onSubmit() {
    this.authtype = this.selectedOption;

    const disabled = this.selectedCategory.name === 'Allow';

    if (this.selectedOption === 'option2') {
      this.brokerService
        .createConnector(
          this.connid,
          this.username,
          this.password,
          this.authtype,
          disabled,
        )
        .subscribe((response) => {
          console.log('Connector created successfully', response);
        });
    }
  }
}
