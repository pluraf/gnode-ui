import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { forkJoin, catchError, of, Observable } from 'rxjs';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { Converter } from '../converter';
import { SubheaderComponent } from '../../../subheader/subheader.component';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';
import { ToastModule } from 'primeng/toast';
import { DeleteComponent } from '../../../shared/delete/delete.component';

@Component({
  selector: 'app-converter-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SubheaderComponent,
    TableModule,
    PaginatorModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    DeleteComponent,
  ],
  templateUrl: './converter-list.component.html',
  styleUrl: './converter-list.component.css',
})
export class ConverterListComponent implements OnInit {
  noteService = inject(NoteService);
  messageService = inject(MessageService);
  apiService = inject(ApiService);
  router = inject(Router);

  visibleDialog: boolean = false;
  converterList: Converter[] = [];
  selectedConverter: Converter[] = [];
  totalRecords!: number;

  showMessage: boolean = false;

  menubarItems: MenuItem[] = [
    {
      routerLink: '/converters/converter-create',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create converter',
      },
      iconClass: 'pi pi-plus m-1',
    },
    {
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Delete converter',
      },
      iconClass: 'pi pi-trash m-1',
      command: () => {
        this.showDialog();
      },
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.loadConverters();
  }

  loadConverters() {
    this.apiService.converterList().subscribe((resp) => {
      if (resp.length === 0) {
        this.showMessage = !this.showMessage;
      } else {
        this.converterList = resp;
      }
    });
  }

  showDialog() {
    if (this.selectedConverter.length === 0) {
      this.noteService.handleWarning('No converters selected!');
      return;
    }
    this.visibleDialog = true;
  }

  onDeleteConverter() {
    let observables: Observable<any>[] = [];
    this.selectedConverter.map((converter) => {
      observables.push(
        this.apiService
          .authbundleDelete(converter.converterId)
          .pipe(catchError((err) => of(true))),
      );
    });

    forkJoin(observables).subscribe({
      next: (response: any) => {
        this.visibleDialog = false;
        this.selectedConverter = [];
        this.loadConverters();
      },
      error: (response: any) => {
        this.visibleDialog = false;
        this.selectedConverter = [];
        this.loadConverters();
      },
    });
  }
}
