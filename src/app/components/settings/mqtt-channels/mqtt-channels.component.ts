import { Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { BackendService } from '../../../services/backend.service';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ChangeDetectorRef } from '@angular/core';

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
  providers: [MessageService],
  templateUrl: './mqtt-channels.component.html',
  styleUrl: './mqtt-channels.component.css',
})
export class MqttChannelsComponent {
  backendService = inject(BackendService);
  messageService = inject(MessageService);

  loading: boolean = false;

  settings = {
    allow_anonymous: false,
  };

  constructor(private cdr: ChangeDetectorRef) {
    this.backendService.getSettings().subscribe((resp) => {
      this.settings = resp;
    });
  }

  onSubmit() {
    const payload = {
      allow_anonymous: this.settings.allow_anonymous,
    };

    this.backendService.updateSettings(payload).subscribe(
      () => {
        this.handleMessage('success', 'Submitted successfully', false);
      },
      (error: any) => {
        this.handleMessage(
          'error',
          error.status === 500 ? error.error : error.error.detail,
          true,
        );
      },
    );
  }

  handleMessage(
    severity: 'success' | 'error',
    detail: string,
    sticky: boolean,
  ) {
    this.messageService.add({ severity, detail });
    this.cdr.markForCheck();
    if (severity === 'success') {
      this.loading = true;
      setTimeout(() => {
        this.clear();
      }, 3000);
    } else if (severity === 'error') {
      this.messageService.add({ severity, detail, sticky: true });
    }
  }

  clear() {
    this.messageService.clear();
    this.loading = false;
  }
}
