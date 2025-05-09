import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ApiService } from '../../../services/api.service';
import { NoteService } from '../../../services/note.service';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { AuthType } from '../../security/authbundle/authbundle';
import { ChannelComponent, SubmitType } from '../channel';


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
    PasswordModule,
  ],
  templateUrl: './channel-edit.component.html',
  styleUrl: '../channel.css',
})
export class ChannelEditComponent extends ChannelComponent implements OnInit {
  noteService = inject(NoteService);
  loaded = false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {
    super();
  }

  ngOnInit() {
      this.chanid = this.route.snapshot.params['chanid'];
      this.apiService.channelGet(this.chanid).subscribe((response: any) => {
        this.loaded = true;
        const channel = response;
        this.onChangeChannelType(channel.type);

        this.clientid = channel.clientid ?? "";
        this.username = channel.username ?? "";
        this.secret = channel.token ?? "";
        this.selectedAuthOption = channel.authtype.toLowerCase();
        this.selectedTypeOption = channel.type;
        this.queue_name = channel.queue_name ?? "";

        if (this.selectedAuthOption === AuthType.JWT_ES256) {
          this.secret = channel.jwtkey;  // .replace(/(.{64})/g, '$1\n');
        }
        this.enabled = channel.enabled;
      });
  }

  onUpdate() {
    if (this.chanid === null) {
      return;
    }
    let payload = this.getSubmitPayload(SubmitType.EDIT);
    this.apiService.channelUpdate(this.chanid, payload).subscribe({
      next: (response) => {
        this.noteService.handleMessage(
          response,
          'Channel updated successfully!',
        );
      },
      error: (response) => {
        this.noteService.handleError(response);
      }
    });
  }
}
