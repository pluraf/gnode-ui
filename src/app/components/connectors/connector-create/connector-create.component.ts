import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

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
    RouterModule,
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
  username = '';
  password = '';
  authtype = '';

  categories: any[] = [
    { name: 'Allow', key: 'A' },
    { name: 'Block', key: 'B' },
  ];

  selectedOption: string = 'option1';

  atuthOptions = [
    { value: 'option1', label: 'JWT_ES250' },
    { value: 'option2', label: 'Username & Password' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.selectedCategory = this.categories[0];
  }

  onSubmit() {
    const selectedOptionObj = this.atuthOptions.find(
      (option) => option.value === this.selectedOption,
    );
    this.authtype = selectedOptionObj ? selectedOptionObj.label : '';

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
          this.router.navigateByUrl('/connectors');
        });
    } else if (this.selectedOption === 'option1') {
      this.brokerService
        .createConnector(this.connid, this.authtype)
        .subscribe((response) => {
          console.log('Connector created successfully', response);
          this.router.navigateByUrl('/connectors');
        });
    }
  }
}
