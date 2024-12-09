import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { SettingsService } from '../../../services/settings.service';
import { ApiService } from '../../../services/api.service';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { NoteService } from '../../../services/note.service';

@Component({
  selector: 'app-g-cloud',
  standalone: true,
  imports: [
    SubheaderComponent,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, NoteService, ConfirmationService],
  templateUrl: './g-cloud.component.html',
  styleUrl: './g-cloud.component.css',
})
export class GCloudComponent {
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  settingsService = inject(SettingsService);
  noteService = inject(NoteService);
  confirmationService = inject(ConfirmationService);

  isGCloudEnabled = true;
  gcloudFormValue: boolean = false;

  constructor() {
    effect(() => {
      this.isGCloudEnabled = this.settingsService.settingsdata().gcloud;
    });
  }

  handleGCloudMessage(type: 'warn' | 'success' | 'error', message: string) {
    this.noteService.handleMessage(this.messageService, type, message);
  }

  onCheckboxChange() {
    if (!this.isGCloudEnabled) {
      this.handleGCloudMessage(
        'warn',
        'Disabling G-Node Cloud Client may affect your service.',
      );
    }
  }

  onSubmit() {
    if (!this.isGCloudEnabled) {
      this.confirmationService.confirm({
        message:
          'Are you sure that you want to proceed? Disabling G-Node Cloud Client may affect your service.',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.updateGcloudStatus();
          this.handleGCloudMessage(
            'success',
            'You have successfully disabled G-Node Cloud Client.',
          );
        },
      });
    } else {
      this.updateGcloudStatus();
    }
  }

  updateGcloudStatus() {
    const payload = {
      gcloud: this.isGCloudEnabled,
    };
    this.settingsService.settingsdata.set({
      ...this.settingsService.settingsdata(),
      gcloud: this.isGCloudEnabled,
    });
    this.apiService.updateSettings(payload).subscribe(
      (resp) => {
        if (resp.error) {
          this.handleGCloudMessage('error', resp.error);
        } else {
          this.handleGCloudMessage(
            'success',
            'G-Node cloud client status submitted successfully!',
          );
        }
      },
      (error) => {
        let erroeMsg = error.status === 500 ? error.error.detail : error.error;
        this.handleGCloudMessage('error', erroeMsg);
      },
    );
  }
}
