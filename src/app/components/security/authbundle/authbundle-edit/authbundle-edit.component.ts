import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SubheaderComponent } from '../../../subheader/subheader.component';
import { AuthType, AuthTypeLabel, ConnectorType, ConnectorTypeLabel, AuthbundleComponent } from '../authbundle';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';

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
export class AuthbundleEditComponent extends AuthbundleComponent {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  @ViewChild('keyFile') keyFileInput!: ElementRef;
  @ViewChild('caFile') caFileInput!: ElementRef;

  override autoId = false;

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.authbundleId = params.get('authbundleId') || '';
      this.apiService.authbundleGet(this.authbundleId).subscribe((response: any) => {
        this.selServiceType = response.service_type;
        this.onChangeConnectorType(this.selServiceType, this.keyFileInput, this.caFileInput);
        this.selAuthOption = response.auth_type;
        this.description = response.description;
        this.username = response.username;
      });
    });
  }

  constructor() {
    super();
  }

  onUpdate() {
    const formData = new FormData();
    formData.append('service_type', this.selServiceType);
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
    formData.append('description', this.description);
    this.apiService.authbundleEdit(this.authbundleId, formData).subscribe(
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
