import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root',
})
export class NoteService {
  ms!: MessageService;

  setMessageService(ms: MessageService) {
    this.ms = ms;
  }

  handleInfo(detail?: any, defaultMessage: string = '') {
    if (typeof detail === 'string') {
      this.handleMessage(null, detail, 'success');
    } else {
      this.handleMessage(detail, defaultMessage, 'success');
    }
  }

  handleWarning(
    detail?: any,
    defaultMessage: string = '',
  ) {
    if (typeof detail === 'string') {
      this.handleMessage(null, detail, 'warn');
    } else {
      this.handleMessage(detail, defaultMessage, 'warn');
    }
  }

  handleError(detail: any, defaultMessage: string = '') {
    if (typeof detail === 'string') {
      this.handleMessage(null, detail, 'error');
    } else {
      this.handleMessage(detail, defaultMessage, 'error');
    }
  }

  handleMessage(detail: any, defaultMessage: string = '', severity?: string) {
    const [message, autoSeverity] = this.parseDetail(detail, defaultMessage);
    severity = severity ?? autoSeverity;

    if (severity === 'success') {
      this.ms.add({
        severity,
        summary: 'Info',
        detail: message,
        life: 3000
      });
    } else if (severity === 'error') {
      this.ms.add({
        severity,
        summary: 'Error',
        detail: message,
        life: 9000
      });
    } else if (severity === 'warn') {
      this.ms.add({
        severity,
        summary: 'Warning',
        detail: message,
        life: 6000
      });
    }
  }

  private parseDetail(detail: any, defaultMessage: string = ''): [string, string] {
    if (! detail) {
      return [defaultMessage, 'success'];
    }else if (
      detail.responses &&
      detail.responses[0]?.hasOwnProperty('error')
    ) {
        return [detail.responses[0].error, 'error'];
    } else if (detail.error) {
      if (detail.error.detail) {
        const ed = detail.error.detail;
        return [typeof ed === 'string' ? ed : JSON.stringify(ed), 'error'];
      } else if (detail.statusText) {
        return [detail.statusText, 'error'];
      } else {
        return [detail.status ?? 'Unknown error', 'error'];
      }
    }
    return [defaultMessage, 'success'];
  }

}
