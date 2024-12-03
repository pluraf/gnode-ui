import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';

import { MBrokerCService } from '../../../services/mbrokerc.service';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NoteService } from '../../../services/note.service';

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
  enabled: boolean = false;

  noteService = inject(NoteService);

  constructor(
    private brokerService: MBrokerCService,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  dataLoaded = false;

  selectedChannelState: any = null;

  channelStates: any[] = [
    { name: 'Enabled', key: 'Allow' },
    { name: 'Disabled', key: 'Block' },
  ];

  selectedOption: string = 'jwt';

  authOptions = [
    { value: 'jwt', label: 'JWT_ES256' },
    { value: 'password', label: 'Username & Password' },
  ];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.chanid = params.get('chanid') || '';

      this.brokerService
        .loadChannelDetails(this.chanid)
        .subscribe((response: any) => {
          this.dataLoaded = true;
          const channel = response.responses[0].data.channel;

          this.clientid = channel.clientid;
          this.username = channel.username;
          this.password = '';
          this.selectedOption =
            channel.authtype.toLowerCase() === 'jwt_es256' ? 'jwt' : 'password';

          if (this.selectedOption === 'jwt' && channel.jwtkey) {
            this.jwtKey = channel.jwtkey.replace(/(.{64})/g, '$1\n');
          }
          this.enabled = channel.disabled;

          if (this.enabled === false) {
            this.selectedChannelState = this.channelStates.find(
              (category) => category.key === 'Block',
            );
          } else {
            this.selectedChannelState = this.channelStates.find(
              (category) => category.key === 'Allow',
            );
          }
        });
    });
  }

  onUpdate() {
    const channelState =
      this.selectedChannelState.key === 'Allow' ? 'Enabled' : 'Disabled';
    const selectedOptionObj = this.authOptions.find(
      (option) => option.value === this.selectedOption,
    );
    this.authtype = selectedOptionObj ? selectedOptionObj.value : '';

    const updateData: any = {
      chanid: this.chanid,
      communicationStatus: channelState,
      authtype: this.authtype,
      clientid: this.clientid || undefined,
      username: this.username || undefined,
      password: this.selectedOption === 'password' ? this.password : undefined,
      jwtkey:
        this.selectedOption === 'jwt'
          ? this.jwtKey.replace(/\n/g, '')
          : undefined,
      enabled: this.enabled,
    };
    this.brokerService.updateChannel(updateData).subscribe((response) => {
      if (response.responses && response.responses[0]) {
        const resp = response.responses[0];
        if (resp.hasOwnProperty('error') && resp.error) {
          this.noteService.handleMessage(
            this.messageService,
            'error',
            resp.error,
          );
        } else {
          this.noteService.handleMessage(
            this.messageService,
            'success',
            'Channel edited successfully!',
          );
        }
      }
    });
  }
}
