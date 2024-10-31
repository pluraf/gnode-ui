import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';

import { BackendService } from '../../../services/backend.service';
import { SubheaderComponent } from '../../subheader/subheader.component';
import {
  AuthType,
  AuthTypeLabel,
  ConnectorType,
  ConnectorTypeLabel,
} from '../authbundle';
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './authbundle-create.component.html',
  styleUrl: './authbundle-create.component.css',
})
export class AuthbundleCreateComponent {
  backendService = inject(BackendService);
  messageService = inject(MessageService);

  authbundleId = '';
  username = '';
  password = '';
  description = '';
  autoId = true;
  usermessage: string = '';
  loading: boolean = false;

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

  getUsernameMessage(): string {
    if (this.selConnectorType === ConnectorType.MQTT50) {
      this.usermessage = 'Username can be empty for MQTT v5.0';
    } else if (this.selConnectorType === ConnectorType.MQTT311) {
      this.usermessage = 'Username can be empty for MQTT v3.11';
    }
    return this.usermessage;
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
    this.backendService.createAuthbundle(formData).subscribe(
      (response) => {
        if (response && response.responses && response.responses.length > 0) {
          if (response.responses[0].hasOwnProperty('error')) {
            this.handleMessage('error', response.responses[0].error, true);
          }
        } else {
          this.handleMessage('success', 'Submitted successfully', false);
        }
      },
      (error: any) => {
        const errorDetail = error.error?.detail;
        this.handleMessage('error', errorDetail, true);
      },
    );
  }

  handleMessage(
    severity: 'success' | 'error',
    detail: string,
    sticky: boolean,
  ) {
    if (severity === 'success') {
      this.messageService.add({ severity, detail });
      this.loading = true;
      setTimeout(() => {
        this.clear();
      }, 3000);
    } else if (severity === 'error') {
      this.messageService.add({ severity, detail, sticky: true });
    }
  }

  clear() {
    this.messageService.clear();
    this.router.navigateByUrl('/authbundles');
  }
}
