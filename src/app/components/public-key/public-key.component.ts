import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MqttBrokerServiceService } from '../../services/mqtt-broker-service.service';
import { ButtonModule } from 'primeng/button';
import { SubheaderComponent } from '../subheader/subheader.component';

@Component({
  selector: 'app-public-key',
  standalone: true,
  imports: [ButtonModule, SubheaderComponent],
  templateUrl: './public-key.component.html',
  styleUrl: './public-key.component.css',
})
export class PublicKeyComponent {
  http = inject(HttpClient);
  brokerService = inject(MqttBrokerServiceService);
  uploadedFilesList: string[] = [];

  uplaodFile(event: any, fileType: string) {
    const file = event.currentTarget.files[0];

    if (file && this.isValidPemFile(file, fileType)) {
      this.brokerService
        .uploadPrivatePublicKey(file, fileType)
        .subscribe((response) => {
          this.uploadedFilesList.push(`${fileType}: ${file.name}`);
        });
    } else {
      console.warn(
        'Only .pem file format is allowed and size should be less than 8MB!',
      );
    }
  }

  isValidPemFile(file: File, fileType: string): boolean {
    const isPem = file.name.endsWith('.pem');
    const isJson = file.name.endsWith('.json');

    if (fileType === 'gcpKey') {
      return isJson && file.size <= 8000000;
    }

    return (isPem || isJson) && file.size <= 8000000;
  }

  onSubmit() {}
}
