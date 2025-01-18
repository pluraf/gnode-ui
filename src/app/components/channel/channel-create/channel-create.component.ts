import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';

import { SubheaderComponent } from '../../subheader/subheader.component';
import { ChannelData } from '../channel';
import { NoteService } from '../../../services/note.service';
import { ApiService } from '../../../services/api.service';


@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    CommonModule,
    FormsModule,
    PasswordModule,
    RouterModule,
    SubheaderComponent,
    ToastModule,
    InputSwitchModule,
  ],
  providers: [MessageService, NoteService],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.css',
})
export class ChannelCreateComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  value!: string;
  communication: string = 'Allow';
  chanid: string = '';
  clientid: string = '';
  username: string = '';
  password: string = '';
  authtype: string = '';
  jwtKey: string = '';
  enabled = true;
  loading: boolean = false;

  selectedOption: string = 'jwt_es256';

  authOptions = [
    { value: 'jwt_es256', label: 'JWT_ES256' },
    { value: 'password', label: 'Username & Password' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  onChangeAuthenticationType(event: any) {
    this.password = '';
  }

  onSubmit() {
    const selectedOptionObj = this.authOptions.find(
      (option) => option.value === this.selectedOption,
    );
    this.authtype = selectedOptionObj ? selectedOptionObj.value : '';

    const payload: Partial<ChannelData> = {
      authtype: this.authtype,
      secret: this.password,
      disabled: !this.enabled,
      username: this.username || undefined,
      clientid: this.clientid || undefined,
    };

    this.apiService.channelCreate(this.chanid, payload).subscribe({
       next: (response: any) => {
        this.noteService.handleMessage(
          this.messageService,
          'success',
          'Channel created successfully!'
        );
       },
       error: (response: any) => {
        this.noteService.handleMessage(
          this.messageService,
          'error',
           response.error ?? response.statusText
        );
      }
    });
  }
}
