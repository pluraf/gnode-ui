import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SubheaderComponent } from '../../../subheader/subheader.component';
import { CAComponent } from '../ca';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';

@Component({
  selector: 'app-dentry-create',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    CommonModule,
    FormsModule,
    SubheaderComponent,
    ToastModule,
  ],
  templateUrl: './ca-add.component.html',
  styleUrl: './ca-add.component.css',
})
export class CAAddComponent extends CAComponent {
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  @ViewChild('keyFile') keyFileInput!: ElementRef;

  caIdModifiedByUser = false;

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  constructor(private router: Router) {
    super();
  }

  onCAIdChanged() {
    this.caIdModifiedByUser = true;
  }

  onFileSelected(event: any) {
    this.caFile = event.target.files[0];
    if (!this.caIdModifiedByUser || !this.caId) {
      this.caId = this.caFile?.name ?? this.caId;
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('ca_id', this.caId);
    if (this.caFile) {
      formData.append('cafile', this.caFile);
    }
    if (this.description) {
      formData.append('description', this.description);
    }
    this.apiService.caAdd(formData).subscribe({
      next: (response) => {
        this.noteService.handleMessage(
          response, 'Certificate added successfully!', 'success'
        );
      },
      error: (response) => {
        this.noteService.handleError(response);
      }
    });
  }
}
