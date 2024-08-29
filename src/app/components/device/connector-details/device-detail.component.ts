import {Component, inject} from '@angular/core';
import {Device} from '../device';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-detail.component.html',
  styleUrl: './device-detail.component.css',
})
export class DeviceDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  connector: any;

  constructor(private http: HttpClient) {
    const connid = this.route.snapshot.params['connid'];
    this.loadConnectorDetails(connid);
  }
  loadConnectorDetails(connid: string) {
    const command = {
      commands: [{
        command: 'getClient',
        connid: connid
      }]
    };
    this.http.post<any>('/broker/command', command).subscribe(response => {
      this.connector = response.responses[0].data.client;
      console.log(this.connector);
    });
  }
}
