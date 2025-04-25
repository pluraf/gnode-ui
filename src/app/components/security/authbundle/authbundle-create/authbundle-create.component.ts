import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SubheaderComponent } from '../../../subheader/subheader.component';
import {
  AuthType,
  AuthTypeLabel,
  ConnectorType,
  ConnectorTypeLabel,
  AuthbundleComponent,
} from '../authbundle';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';

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
  templateUrl: './authbundle-create.component.html',
  styleUrl: './authbundle-create.component.css',
})
export class AuthbundleCreateComponent extends AuthbundleComponent {
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  @ViewChild('keyFile') keyFileInput!: ElementRef;
  @ViewChild('caFile') caFileInput!: ElementRef;

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  constructor(private router: Router) {
    super();
    this.selServiceType = ConnectorType.GCP;
    this.onChangeConnectorType(this.selServiceType, this.keyFileInput, this.caFileInput);
  }

  onChangeAutoId(event: any) {
    if (event === true) {
      this.authbundleId = this.caFile?.name ?? this.authbundleId;
    } else {
      this.authbundleId = '';
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('service_type', this.selServiceType);
    formData.append('auth_type', this.selAuthOption);
    if (this.authbundleId) {
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
    if (this.caFile) {
      formData.append('keyfile', this.caFile);
    }
    if (this.description) {
      formData.append('description', this.description);
    }
    this.apiService.authbundleCreate(formData).subscribe({
      next: (response: any) => {
        this.noteService.handleMessage(response, 'Authbundle submitted successfully!');
      },
      error: (error: any) => {
        this.noteService.handleError(error);
      }
    });
  }
}
