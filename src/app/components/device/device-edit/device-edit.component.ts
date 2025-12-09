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
import { DeviceComponent, SubmitType } from '../device';


@Component({
  selector: 'app-device-edit',
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
  templateUrl: './device-edit.component.html',
  styleUrl: '../device.css',
})
export class DeviceEditComponent extends DeviceComponent implements OnInit {
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
      this.devid = this.route.snapshot.params['devid'];
      this.apiService.deviceGet(this.devid).subscribe((response: any) => {
        this.loaded = true;
        const device = response;
        this.onChangeDeviceType(device.type);
        this.selectedTypeOption = device.type;
        this.enabled = device.enabled;
      });
  }

  onUpdate() {
    if (this.devid === null) {
      return;
    }
    let payload = this.getSubmitPayload(SubmitType.EDIT);
    this.apiService.deviceUpdate(this.devid, payload).subscribe({
      next: (response) => {
        this.noteService.handleMessage(
          response,
          'Device updated successfully!',
        );
      },
      error: (response) => {
        this.noteService.handleError(response);
      }
    });
  }
}
