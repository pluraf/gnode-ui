import { Component, inject } from '@angular/core';
import { SubheaderComponent } from '../../subheader/subheader.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-g-cloud',
  standalone: true,
  imports: [
    SubheaderComponent,
    CheckboxModule,
    FormsModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './g-cloud.component.html',
  styleUrl: './g-cloud.component.css',
})
export class GCloudComponent {
  backendService = inject(BackendService);
  messageService = inject(MessageService);

  loading: boolean = false;

  settings = {
    allow_gcloud: false,
  };

  constructor() {
    this.backendService.loadSettings().subscribe((resp) => {
      this.settings = resp;
    });
  }

  ngOnInit() {
    this.backendService.getApiInfo().subscribe((resp) => {
      console.log(resp);
    });
  }

  onSubmit() {
    const payload = {
      gcloud: this.settings.allow_gcloud,
    };

    this.backendService.updateSettings(payload).subscribe(
      () => {
        this.handleMessage('success', 'Submitted successfully', false);
      },
      (error: any) => {
        const errorMsg =
          error.status === 500 ? error.error.detail : error.error;
        this.handleMessage('error', errorMsg, true);
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
