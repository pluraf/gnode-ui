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

  isGCloudEnabled = false;


  constructor() {
    this.backendService.getSettings().subscribe((resp) => {
      this.isGCloudEnabled = resp.gcloud;
    });
  }

  onSubmit() {
    const payload = {
      gcloud: this.isGCloudEnabled,
    };

    this.backendService.updateSettings(payload).subscribe(resp => {
    });
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
