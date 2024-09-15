import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';

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
  ],
  templateUrl: './connector-edit.component.html',
  styleUrl: './connector-edit.component.css',
})
export class ConnectorEditComponent implements OnInit {
  value: string = '';
  connid = '';

  constructor(private brokerService: MqttBrokerServiceService) {}

  selectedCategory: any = null;
  categories: any[] = [
    { name: 'Allow', key: 'A' },
    { name: 'Block', key: 'B' },
  ];
  ngOnInit() {
    this.selectedCategory = this.categories[0];
  }
  onUpdate() {
    const communicationStatus =
      this.selectedCategory.key === 'A' ? 'Allow' : 'Block';

    const updateData = {
      connid: this.connid,
      communicationStatus: communicationStatus,
    };

    console.log('Updating connector with ID:', updateData.connid);
    console.log('Communication status:', updateData.communicationStatus);
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
