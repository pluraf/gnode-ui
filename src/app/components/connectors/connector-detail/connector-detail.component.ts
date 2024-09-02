import { Component } from '@angular/core';
import { Device } from '../device';
import { CommonModule } from '@angular/common';
import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';

@Component({
  selector: 'app-connector-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connector-detail.component.html',
  styleUrl: './connector-detail.component.css',
})
export class ConnectorDetailComponent {
  data: any;
  constructor(private brokerService: MqttBrokerServiceService) {
    this.brokerService.testBroker().subscribe({
      next: (response: { responses: any[] }) => {
        console.log(response);
        this.data = response.responses.find(
          (r: { command: string }) => r.command === 'listClients',
        )?.data;
      },
      error: (error: any) => console.error('There was an error!', error),
    });
  }
}
