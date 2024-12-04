import { Component, effect, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SettingsService } from '../../../services/settings.service';
import { ApiService } from '../../../services/api.service';
import { NoteService } from '../../../services/note.service';

@Component({
  selector: 'app-mqtt-channels',
  standalone: true,
  imports: [
    SubheaderComponent,
    CheckboxModule,
    DividerModule,
    FormsModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService, NoteService],
  templateUrl: './mqtt-channels.component.html',
  styleUrl: './mqtt-channels.component.css',
})
export class MqttChannelsComponent {
  settingsService = inject(SettingsService);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  allow_anonymous: boolean = false;

  constructor() {
    effect(() => {
      this.allow_anonymous =
        this.settingsService.settingsdata().allow_anonymous;
    });
  }

  onSubmit() {
    const payload = {
      allow_anonymous: this.allow_anonymous,
    };
    this.settingsService.settingsdata.set({
      ...this.settingsService.settingsdata(),
      allow_anonymous: this.allow_anonymous,
    });
    this.apiService.updateSettings(payload).subscribe(
      () => {
        this.noteService.handleMessage(
          this.messageService,
          'success',
          'Submitted successfully!',
        );
      },
      (error: any) => {
        let errorMsg = error.status === 500 ? error.error : error.error.detail;
        this.noteService.handleMessage(this.messageService, 'error', errorMsg);
      },
    );
  }
}
