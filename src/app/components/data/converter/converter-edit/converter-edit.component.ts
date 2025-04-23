import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SubheaderComponent } from '../../../subheader/subheader.component';
import { Converter, ConverterComponent } from '../converter';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';


@Component({
  selector: 'app-converter-edit',
  standalone: true,
  imports: [
    SubheaderComponent,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
  ],
  providers: [MessageService, NoteService],
  templateUrl: './converter-edit.component.html',
  styleUrl: './converter-edit.component.css',
})
export class ConverterEditComponent extends ConverterComponent {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  override autoId = false;

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.converterId = params.get('converterId') || '';
      this.apiService.converterGet(this.converterId).subscribe((response: any) => {
        this.description = response.description;
        this.converterCode = response.code;
      });
    });
  }

  constructor() {
    super();
  }

  onUpdate() {
    const formData = new FormData();
    formData.append('description', this.description);
    formData.append('code', this.converterCode);

    this.apiService.converterUpdate(this.converterId, formData).subscribe({
      next: (response) => {
        this.noteService.handleMessage(
          this.messageService,
          'success',
          'Converter updated successfully!',
        );
      },
      error: (response) => {
        this.noteService.handleMessage(
          this.messageService,
          'error',
          response.error?.detail ?? response.statusText,
        );
      }
    });
  }

}
