import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SubheaderComponent } from '../../../subheader/subheader.component';
import { ConverterComponent } from '../converter';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';


@Component({
  selector: 'app-converter-create',
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
  templateUrl: './converter-create.component.html',
  styleUrl: './converter-create.component.css',
})
export class ConverterCreateComponent extends ConverterComponent {
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  constructor(private router: Router) {
    super();
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('converter_id', this.converterId);
    formData.append('code', this.converterCode);
    formData.append('description', this.description);

    this.apiService.converterCreate(formData).subscribe({
      next: (response) => {
        this.noteService.handleInfo(
          'Converter created successfully!',
        );
      },
      error: (response) => {
        this.noteService.handleError(response);
      }
    });
  }

}
