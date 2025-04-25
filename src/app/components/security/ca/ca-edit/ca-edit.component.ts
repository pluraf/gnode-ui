import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SubheaderComponent } from '../../../subheader/subheader.component';
import { CAComponent } from '../ca';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';


@Component({
  selector: 'app-authbundle-edit',
  standalone: true,
  imports: [
    SubheaderComponent,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
  ],
  templateUrl: './ca-edit.component.html',
  styleUrl: './ca-edit.component.css',
})
export class CAEditComponent extends CAComponent {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  @ViewChild('keyFile') keyFileInput!: ElementRef;

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.caId = params.get('caId') || '';
      this.apiService.caGet(this.caId).subscribe((response: any) => {
        this.description = response.description;
      });
    });
  }

  constructor() {
    super();
  }

  onChangeAutoId(event: any) {
    this.caId = '';
  }

  onFileSelected(event: any) {
    this.caFile = event.target.files[0];
  }

  onUpdate() {
    const formData = new FormData();
    if (this.caFile) {
      formData.append('keyfile', this.caFile);
    }
    formData.append('description', this.description);
    this.apiService.caEdit(this.caId, formData).subscribe({
      next: (response) => {
        this.noteService.handleMessage(
          response, 'Certificate added successfully!', 'success'
        );
      },
      error: (response) => {
        this.noteService.handleError(response);
      },
    });
  }
}
