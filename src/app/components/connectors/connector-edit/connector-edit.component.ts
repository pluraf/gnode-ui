import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';

import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';
import { SubheaderComponent } from '../../subheader/subheader.component';

@Component({
  selector: 'app-connector-edit',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    CommonModule,
    RadioButtonModule,
    SubheaderComponent,
  ],
  templateUrl: './connector-edit.component.html',
  styleUrl: './connector-edit.component.css',
})
export class ConnectorEditComponent implements OnInit {
  value: string = '';
  connid: string = '';

  constructor(
    private brokerService: MqttBrokerServiceService,
    private route: ActivatedRoute,
  ) {}

  selectedCategory: any = null;
  categories: any[] = [
    { name: 'Enabled', key: 'A' },
    { name: 'Disabled', key: 'B' },
  ];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.connid = params.get('connid') || '';
    });

    this.selectedCategory = this.categories[0];
  }

  onUpdate() {
    const communicationStatus =
      this.selectedCategory.key === 'A' ? 'Enabled' : 'Disabled';

    const updateData = {
      connid: this.connid,
      communicationStatus: communicationStatus,
    };

    this.brokerService.updateConnector(updateData).subscribe(
      (response) => {
        console.log('Update successful:', response);
      },
      (error) => {
        console.error('Update failed:', error);
      },
    );
  }
}
