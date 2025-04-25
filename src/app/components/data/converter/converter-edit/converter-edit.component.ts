import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SubheaderComponent } from '../../../subheader/subheader.component';
import { Converter, ConverterComponent } from '../converter';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';
import { DeleteComponent } from '../../../shared/delete/delete.component';


@Component({
  selector: 'app-converter-edit',
  standalone: true,
  imports: [
    SubheaderComponent,
    DeleteComponent,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
  ],
  templateUrl: './converter-edit.component.html',
  styleUrl: './converter-edit.component.css',
})
export class ConverterEditComponent extends ConverterComponent {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  menubarItems: MenuItem[] = [];
  override autoId = false;
  visibleDialog: boolean = false;

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
    this.menubarItems = [
      {
        tooltipOptions: {
          tooltipEvent: 'hover',
          tooltipPosition: 'bottom',
          tooltipLabel: 'Delete pipeline',
        },
        iconClass: 'pi pi-trash m-1',
        command: () => {
          this.showDialog();
        },
      },
    ];
  }

  showDialog() {
    this.visibleDialog = true;
  }

  onDeleteConverter() {
    this.apiService.converterDelete(this.converterId).subscribe({
      next: (response: any) => {
        this.visibleDialog = false;
        this.router.navigateByUrl('/converters');
      },
    });
  }

  onUpdate() {
    const formData = new FormData();
    formData.append('description', this.description);
    formData.append('code', this.converterCode);

    this.apiService.converterUpdate(this.converterId, formData).subscribe({
      next: (response) => {
        this.noteService.handleInfo(
          'Converter updated successfully!',
        );
      },
      error: (response) => {
        this.noteService.handleError(response);
      }
    });
  }

}
