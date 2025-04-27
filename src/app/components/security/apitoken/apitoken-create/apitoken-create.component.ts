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
import { ApitokenComponent } from '../apitoken';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';


@Component({
  selector: 'app-apitoken-create',
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
  templateUrl: './apitoken-create.component.html',
  styleUrl: '../apitoken.css',
})
export class ApitokenCreateComponent extends ApitokenComponent {
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
    const payload = {
      'state': this.apitoken.duration,
      'description': this.apitoken.description,
      'duration': this.apitoken.duration
    };

    this.apiService.apitokenCreate(payload).subscribe({
      next: (response) => {
        this.noteService.handleInfo(
          'APIToken created successfully!',
        );
      },
      error: (response) => {
        this.noteService.handleError(response);
      }
    });
  }

}
