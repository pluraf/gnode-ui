import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MqttBrokerServiceService } from '../../services/mqtt-broker-service.service';

@Component({
  selector: 'app-public-key',
  standalone: true,
  imports: [],
  templateUrl: './public-key.component.html',
  styleUrl: './public-key.component.css',
})
export class PublicKeyComponent {
  http = inject(HttpClient);
  brokerService = inject(MqttBrokerServiceService);
  uploadedFilesList: string[] = [];

  uplaodFile(event: any) {
    debugger;
    const file = event.currentTarget.files[0];

    if (file && file.type == 'image/jpeg' && file.size > 8000000) {
      this.brokerService.uploadPrivatePublicKey(file).subscribe((response) => {
        this.uploadedFilesList.push(response);
      });
    } else if (file.size < 8000000) {
      console.warn('File size is greater');
    } else {
      console.warn('Only .pem file format is allowed!');
    }
  }
}
