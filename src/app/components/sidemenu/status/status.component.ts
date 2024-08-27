import { Component } from '@angular/core';
import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  data: any;

  constructor(private brokerService: MqttBrokerServiceService) {
    this.brokerService.testBroker().subscribe({
      next: (response: { responses: any[] }) => {
        console.log(response);
        this.data = response.responses.find(
          (r: { command: string }) => r.command === 'listRoles',
        )?.data;
      },
      error: (error: any) => console.error('There was an error!', error),
    });
  }
}
