import { Component, inject } from '@angular/core';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-g-cloud',
  standalone: true,
  imports: [SubheaderComponent, CheckboxModule, FormsModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './g-cloud.component.html',
  styleUrl: './g-cloud.component.css',
})
export class GCloudComponent {
  backendService = inject(BackendService);
  messageService = inject(MessageService);

  loading: boolean = false;

  settings = {
    allow_gnode_cloud: false,
  };

  constructor() {
    this.backendService.loadSettings().subscribe((resp) => {
      this.settings = resp;
    });
  }

  onSubmit() {
    this.loading = true;

    const payload = {
      allow_gnode_cloud: this.settings.allow_gnode_cloud,
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
    if (severity === 'success') {
      this.messageService.add({ severity, detail });
      this.loading = false;
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
