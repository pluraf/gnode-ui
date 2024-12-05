import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ApiService } from '../../../services/api.service';
import { NoteService } from '../../../services/note.service';
import { SubheaderComponent } from '../../subheader/subheader.component';


@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    CommonModule,
    RadioButtonModule,
    SubheaderComponent,
    ToastModule,
    InputSwitchModule,
  ],
  providers: [MessageService, NoteService],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.css',
})
export class ChannelEditComponent implements OnInit {
  value: string = '';
  chanid: string = '';
  clientid = '';
  username = '';
  password = '';
  authtype = '';
  jwtKey = '';
  enabled: boolean = true;

  noteService = inject(NoteService);

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  dataLoaded = false;

  selectedOption: string = 'jwt';

  authOptions = [
    { value: 'jwt', label: 'JWT_ES256' },
    { value: 'password', label: 'Username & Password' },
  ];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.chanid = params.get('chanid') || '';

      this.apiService.channelGet(this.chanid).subscribe((response: any) => {
          this.dataLoaded = true;
          const channel = response;

          this.clientid = channel.clientid;
          this.username = channel.username;
          this.password = '';
          this.selectedOption =
            channel.authtype.toLowerCase() === 'jwt_es256' ? 'jwt' : 'password';

          if (this.selectedOption === 'jwt' && channel.jwtkey) {
            this.jwtKey = channel.jwtkey.replace(/(.{64})/g, '$1\n');
          }
          this.enabled = !channel.disabled;
        });
    });
  }

  onUpdate() {
    const selectedOptionObj = this.authOptions.find(
      (option) => option.value === this.selectedOption,
    );
    this.authtype = selectedOptionObj ? selectedOptionObj.value : '';

    const updateData: any = {
      chanid: this.chanid,
      authtype: this.authtype,
      clientid: this.clientid || undefined,
      username: this.username || undefined,
      password: this.selectedOption === 'password' && this.password ? this.password : undefined,
      jwtkey:
        this.selectedOption === 'jwt' && this.jwtKey
          ? this.jwtKey.replace(/\n/g, '')
          : undefined,
      disabled: !this.enabled,
    };
    this.apiService.channelUpdate(this.chanid, updateData).subscribe({
      next: (response) => {
        this.noteService.handleMessage(
          this.messageService,
          'success',
          'Channel edited successfully!',
        );
      },
      error: (response) => {
        this.noteService.handleMessage(
          this.messageService,
          'error',
          response.error,
        );
      }
    });
  }
}
