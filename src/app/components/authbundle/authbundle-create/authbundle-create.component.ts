import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

import { BackendService } from '../../../services/backend.service';
import { SubheaderComponent } from '../../subheader/subheader.component';

enum AuthType {
  JWT_ES256 = 'jwt_es256',
  PASSWORD = 'password',
  SERVICE_KEY = 'service_key',
}

enum AuthTypeLabel {
  JWT_ES256 = 'JWT_ES256',
  PASSWORD = 'Username & Password',
  SERVICE_KEY = 'Service Key',
}

enum ConnectorType {
  GCP_PUBSUB = 'gcp_pubsub',
  MQTT311 = 'mqtt311',
  MQTT50 = 'mqtt50',
}

enum ConnectorTypeLabel {
  GCP_PUBSUB = 'Google Pubsub',
  MQTT311 = 'MQTT v3.11',
  MQTT50 = 'MQTT v5.0',
}

@Component({
  selector: 'app-authbundle-create',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    CommonModule,
    FormsModule,
    SubheaderComponent,
  ],
  templateUrl: './authbundle-create.component.html',
  styleUrl: './authbundle-create.component.css',
})
export class AuthbundleCreateComponent {
  backendService = inject(BackendService);
  authbundleId = '';
  username = '';
  password = '';
  description = '';
  autoId = true;
  messages: string = '';

  authOptions: { [key: string]: string } = {};

  ConnectorTypes: { [key: string]: string } = {};

  selConnectorType: any;
  selAuthOption: string;
  keyFile: File | null = null;

  @ViewChild('keyFile') keyFileInput!: ElementRef;

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  showUploadKey(): boolean {
    return (
      this.selConnectorType == ConnectorType.GCP_PUBSUB ||
      this.selAuthOption == AuthType.JWT_ES256
    );
  }

  showUsername(): boolean {
    return (
      this.selConnectorType == ConnectorType.MQTT50 ||
      this.selConnectorType == ConnectorType.MQTT311
    );
  }

  showPassword(): boolean {
    return this.selAuthOption == AuthType.PASSWORD;
  }

  constructor(private router: Router) {
    this.selConnectorType = ConnectorType.GCP_PUBSUB;
    this.selAuthOption = AuthType.SERVICE_KEY;

    this.ConnectorTypes[ConnectorType.GCP_PUBSUB] = 'Google Pubsub';
    this.ConnectorTypes[ConnectorType.MQTT50] = 'MQTT v5.0';
    this.ConnectorTypes[ConnectorType.MQTT311] = 'MQTT v3.11';

    this.authOptions[AuthType.SERVICE_KEY] = AuthTypeLabel.SERVICE_KEY;
  }

  cleanIrrelevantInputs() {
    if (this.selAuthOption == AuthType.PASSWORD) {
      this.keyFile = null;
      if (this.keyFileInput) {
        this.keyFileInput.nativeElement.value = '';
      }
    } else if (
      this.selAuthOption == AuthType.JWT_ES256 ||
      this.selAuthOption == AuthType.SERVICE_KEY
    ) {
      this.password = '';
    } else {
      this.keyFile = null;
      if (this.keyFileInput) {
        this.keyFileInput.nativeElement.value = '';
      }
      this.username = '';
      this.password = '';
    }

    if (this.selConnectorType == ConnectorType.GCP_PUBSUB) {
      this.username = '';
      this.password = '';
    }
  }

  onChangeAuthOption(event: any) {
    this.cleanIrrelevantInputs();
  }

  onChangeConnectorType(event: any) {
    this.authOptions = {};
    if (event === ConnectorType.GCP_PUBSUB) {
      this.authOptions[AuthType.SERVICE_KEY] = AuthTypeLabel.SERVICE_KEY;
      this.selAuthOption = AuthType.SERVICE_KEY;
    } else if (
      event === ConnectorType.MQTT311 ||
      event == ConnectorType.MQTT50
    ) {
      this.authOptions[AuthType.JWT_ES256] = AuthTypeLabel.JWT_ES256;
      this.authOptions[AuthType.PASSWORD] = AuthTypeLabel.PASSWORD;
      this.selAuthOption = AuthType.JWT_ES256;
    }
    this.cleanIrrelevantInputs();
  }

  onChangeAutoId(event: any) {
    this.authbundleId = '';
  }

  onFileSelected(event: any) {
    this.keyFile = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('connector_type', this.selConnectorType);
    formData.append('auth_type', this.selAuthOption);
    if (!this.autoId) {
      formData.append('authbundle_id', this.authbundleId);
    }
    if (this.username) {
      formData.append('username', this.username);
    }
    if (this.password) {
      formData.append('password', this.password);
    }
    if (this.keyFile) {
      formData.append('keyfile', this.keyFile);
    }
    if (this.description) {
      formData.append('description', this.description);
    }
    this.backendService.createAuthbundle(formData).subscribe((res) => {
      this.showMessage('Authbundle created successfully!');
    });
  }
  showMessage(message: string) {
    this.messages = message;
  }
}
