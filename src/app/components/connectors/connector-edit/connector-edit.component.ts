import { Component, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../../shared/primeng-modules';
import { CommonModule } from '@angular/common';
import { MqttBrokerServiceService } from '../../../services/mqtt-broker-service.service';

@Component({
  selector: 'app-connector-edit',
  standalone: true,
  imports: [PRIMENG_MODULES, CommonModule],
  templateUrl: './connector-edit.component.html',
  styleUrl: './connector-edit.component.css',
})
export class ConnectorEditComponent implements OnInit {
  value: string = '';
  data: any;
  connID = '';

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

  selectedCategory: any = null;
  categories: any[] = [
    { name: 'Allow', key: 'A' },
    { name: 'Block', key: 'B' },
  ];
  ngOnInit() {
    this.selectedCategory = this.categories[0];
  }
  update() {
    this.brokerService.updateData(this.connID).subscribe((response) => {
      console.log('Update successful:', response);
    });
  }
}
