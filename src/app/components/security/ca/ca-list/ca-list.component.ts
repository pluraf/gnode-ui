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
import { ToastModule } from 'primeng/toast';

import { CA, CAComponent } from '../ca';
import { SubheaderComponent } from '../../../subheader/subheader.component';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';
import { DeleteComponent } from '../../../shared/delete/delete.component';

@Component({
  selector: 'app-certificate-list',
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
        tooltipLabel: 'Delete authbundle',
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
      this.noteService.handleWarning('No channels selected!');
      return;
    }
    this.visibleDialog = true;
  }

  onDelete() {
    let observables: Observable<any>[] = [];
    this.selectedCAs.map((ca) => {
      observables.push(
        this.apiService
          .caDelete(ca.id)
          .pipe(catchError((err) => of(true))),
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
