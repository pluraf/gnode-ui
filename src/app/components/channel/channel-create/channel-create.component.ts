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
import { ChannelComponent, SubmitType } from '../../channel/channel';
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
  templateUrl: './channel-create.component.html',
  styleUrl: '../channel.css',
})
export class ChannelCreateComponent extends ChannelComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  constructor(private router: Router) {
    super();
  }

  ngOnInit() {
    this.selectedTypeOption = this.channelTypes[0].value;
    this.onChangeChannelType(this.selectedTypeOption);
  }

  onSubmit() {
    let payload = this.getSubmitPayload(SubmitType.CREATE);

    this.apiService.channelCreate(this.chanid, payload).subscribe({
       next: (response: any) => {
        this.noteService.handleMessage(response, 'Channel created successfully!');
       },
       error: (response: any) => {
        this.noteService.handleError(response);
      }
    });
  }
}
