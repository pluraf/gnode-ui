import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  handleMessage(
    messageService: MessageService,
    severity: 'success' | 'error' | 'warn',
    detail: string,
    summary?: string,
  ) {
    let displaySeverity = 'Warning';
    if (severity === 'success') {
      messageService.add({ severity, detail, life: 3000 });
    } else if (severity === 'error') {
      messageService.add({ severity, detail, sticky: true });
    } else if (severity === 'warn') {
      messageService.add({
        severity,
        summary: displaySeverity,
        detail,
        sticky: true,
      });
    }
  }
}
