import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { forkJoin, catchError, of, Observable } from 'rxjs';

import { MenuItem, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { CA, CAComponent } from '../ca';
import { SubheaderComponent } from '../../../subheader/subheader.component';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';
import { DeleteComponent } from '../../../shared/delete/delete.component';
import {
  ITableColumn,
  ReusableTableComponent,
} from '../../../shared/reusable-table/reusable-table.component';

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SubheaderComponent,
    DialogModule,
    ButtonModule,
    ToastModule,
    DeleteComponent,
    ReusableTableComponent,
  ],
  providers: [MessageService, NoteService],
  templateUrl: './ca-list.component.html',
  styleUrl: './ca-list.component.css',
})
export class CAListComponent extends CAComponent implements OnInit {
  noteService = inject(NoteService);
  messageService = inject(MessageService);
  apiService = inject(ApiService);
  router = inject(Router);

  visibleDialog: boolean = false;
  caList: CA[] = [];
  selectedCAs: CA[] = [];
  totalRecords!: number;

  showMessage: boolean = false;

  columnList: ITableColumn[] = [
    {
      fieldName: 'id',
      headerName: 'CA Certificate ID',
      routePage: (row: any) => `/ca/ca-detail/${row.id}`,
    },
    {
      fieldName: 'description',
      headerName: 'Description',
    },
  ];

  menubarItems: MenuItem[] = [
    {
      routerLink: '/ca/ca-add',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Add CA Certificate',
      },
      iconClass: 'pi pi-plus m-1',
    },
    {
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Delete Certificate',
      },
      iconClass: 'pi pi-trash m-1',
      command: () => {
        this.showDialog();
      },
    },
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.loadCertificates();
  }

  loadCertificates() {
    this.apiService.caList().subscribe((resp) => {
      if (resp.length === 0) {
        this.showMessage = !this.showMessage;
      } else {
        this.caList = resp;
      }
    });
  }

  showDialog() {
    if (this.selectedCAs.length === 0) {
      this.noteService.handleMessage(
        this.messageService,
        'warn',
        'No CA certificate selected.',
      );
      return;
    }
    this.visibleDialog = true;
  }

  onDelete() {
    let observables: Observable<any>[] = [];
    this.selectedCAs.map((ca) => {
      observables.push(
        this.apiService.caDelete(ca.id).pipe(catchError((err) => of(true))),
      );
    });

    forkJoin(observables).subscribe({
      next: (response: any) => {
        this.visibleDialog = false;
        this.selectedCAs = [];
        this.loadCertificates();
      },
      error: (response: any) => {
        this.visibleDialog = false;
        this.selectedCAs = [];
        this.loadCertificates();
      },
    });
  }
}
