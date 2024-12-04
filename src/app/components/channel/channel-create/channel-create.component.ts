import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';

import { MBrokerCService } from '../../../services/mbrokerc.service';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ChannelData } from '../channel';
import { NoteService } from '../../../services/note.service';

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
  ],
  providers: [MessageService, NoteService],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.css',
})
export class ChannelCreateComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  brokerService = inject(MBrokerCService);
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
  loading: boolean = false;

  selectedChannelState: { name: string; key: string } | null = null;

  channelStates: { name: string; key: string }[] = [
    { name: 'Enabled', key: 'Allow' },
    { name: 'Disabled', key: 'Block' },
  ];

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
      chanid: this.chanid,
      authtype: this.authtype,
      password: this.password,
      disabled: this.selectedChannelState?.key === 'Allow',
      username: this.username || undefined,
      clientid: this.clientid || undefined,
    };

    this.brokerService.createChannel(payload).subscribe(
      (response: any) => {
        if (response.responses[0].error) {
          this.noteService.handleMessage(
            this.messageService,
            'error',
            response.responses[0].error,
          );
        } else {
          this.noteService.handleMessage(
            this.messageService,
            'success',
            'Channel created successfully!',
          );
        }
      },
      (error: any) => {
        const errorMessage =
          error?.message ||
          (typeof error?.error === 'string' && error.error) ||
          (error?.status &&
            error?.statusText &&
            `${error.status}: ${error.statusText}`) ||
          (error?.status && `Error Code: ${error.status}`) ||
          'An unknown error occurred';
        this.noteService.handleMessage(
          this.messageService,
          'error',
          errorMessage,
        );
      },
    );
  }
}
