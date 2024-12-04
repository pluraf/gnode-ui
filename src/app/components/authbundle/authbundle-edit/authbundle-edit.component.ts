import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { AuthType, AuthTypeLabel, ConnectorType } from '../authbundle';
import { ApiService } from '../../../services/api.service';
import { NoteService } from '../../../services/note.service';

@Component({
  selector: 'app-authbundle-edit',
  standalone: true,
  imports: [
    SubheaderComponent,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
  ],
  providers: [MessageService, NoteService],
  templateUrl: './authbundle-edit.component.html',
  styleUrl: './authbundle-edit.component.css',
})
export class AuthbundleEditComponent {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  authbundleId = '';
  username = '';
  password = '';
  description = '';
  autoId = true;
  usermessage: string = '';

  authOptions: { [key: string]: string } = {};

  ConnectorTypes: { [key: string]: string } = {};

  selServiceType: any;
  selAuthOption: string;
  keyFile: File | null = null;

  @ViewChild('keyFile') keyFileInput!: ElementRef;

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  showUploadKey(): boolean {
    return (
      this.selServiceType == ConnectorType.GCP ||
      this.selAuthOption == AuthType.JWT_ES256
    );
  }

  showUsername(): boolean {
    return (
      this.selServiceType == ConnectorType.MQTT50 ||
      this.selServiceType == ConnectorType.MQTT311
    );
  }

  getUsernameMessage(): string {
    if (this.selServiceType === ConnectorType.MQTT50) {
      this.usermessage = 'Username can be empty for MQTT v5.0';
    } else if (this.selServiceType === ConnectorType.MQTT311) {
      this.usermessage = 'Username can be empty for MQTT v3.11';
    }
    return this.usermessage;
  }

  showPassword(): boolean {
    return this.selAuthOption == AuthType.PASSWORD;
  }

  constructor() {
    this.authbundleId = this.route.snapshot.params['authbundleId'];
    this.selServiceType = ConnectorType.GCP;
    this.selAuthOption = AuthType.SERVICE_KEY;

    this.ConnectorTypes[ConnectorType.GCP] = 'Google Pubsub';
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

    if (this.selServiceType == ConnectorType.GCP) {
      this.username = '';
      this.password = '';
    }
  }

  onChangeAuthOption(event: any) {
    this.cleanIrrelevantInputs();
  }

  onChangeConnectorType(event: any) {
    this.authOptions = {};
    if (event === ConnectorType.GCP) {
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

  onUpdate() {
    const formData = new FormData();
    formData.append('connector_type', this.selServiceType);
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
    this.apiService.editAuthbundle(this.authbundleId, formData).subscribe(
      (response) => {
        if (
          response.responses &&
          response.responses[0].hasOwnProperty('error')
        ) {
          this.noteService.handleMessage(
            this.messageService,
            'error',
            response.responses[0].error,
          )!;
        } else {
          this.noteService.handleMessage(
            this.messageService,
            'success',
            'Authbundle edited successfully!',
          );
        }
      },
      (error: any) => {
        const errorDetail = error.error?.detail;
        this.noteService.handleMessage(
          this.messageService,
          'error',
          errorDetail,
        );
      },
    );
  }
}
