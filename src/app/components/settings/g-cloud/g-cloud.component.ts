import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
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

  isHTTPSEnabled = false;
  isSSHEnabled = false;
  gcloudFormValue: boolean = false;

  constructor() {
    effect(() => {
      this.isHTTPSEnabled = this.settingsService.settingsdata().gcloud.https !== null;
      this.isSSHEnabled = this.settingsService.settingsdata().gcloud.ssh !== null;
    });
  }

  handleGCloudMessage(type: 'warn' | 'success' | 'error', message: string) {
    this.noteService.handleMessage(this.messageService, type, message);
  }

  onCheckboxChange() {
    if (!this.isHTTPSEnabled) {
      this.handleGCloudMessage(
        'warn',
        'Disabling G-Node API Forwarding will result in losing access to the G-Node via G-Cloud!',
      );
    }
  }

  onSubmit() {
    if (!this.isHTTPSEnabled && this.settingsService.settingsdata().gcloud.https) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to proceed? You will no longer be able to connect to your G-Node via iotplan.io!',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.updateGcloudStatus();
        },
      });
    } else {
      this.updateGcloudStatus();
    }
  }

  updateGcloudStatus() {
    const payload = {
      gcloud: {
        https: this.isHTTPSEnabled,
        ssh: this.isSSHEnabled,
      }
    };
    this.apiService.updateSettings(payload).subscribe({
      next: (resp) => {
        this.settingsService.load();
        this.noteService.handleMessage(
          this.messageService,
          'success',
          'Submitted successfully',
        );},
      error: (error) => {
        this.noteService.handleMessage(
          this.messageService,
          'error',
          error.error.detail,
        )
      }
    });
  }
}
