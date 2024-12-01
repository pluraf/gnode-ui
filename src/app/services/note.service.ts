import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  handleMessage(
    messageService: MessageService,
    severity: 'success' | 'error',
    detail: string,
  ) {
    if (severity === 'success') {
      messageService.add({ severity, detail, life: 3000 });
    } else if (severity === 'error') {
      messageService.add({ severity, detail, sticky: true });
    }
  }
}