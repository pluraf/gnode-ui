import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { forkJoin, catchError, of, Observable } from 'rxjs';

import { MenuItem, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { Authbundle } from '../authbundle';
import { SubheaderComponent } from '../../../subheader/subheader.component';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';
import { DeleteComponent } from '../../../shared/delete/delete.component';
import {
  ITableColumn,
  SupremeTableComponent,
} from '../../../shared/supreme-table/supreme-table.component';

@Component({
  selector: 'app-authbundle-list',
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
    SupremeTableComponent,
  ],
  templateUrl: './authbundle-list.component.html',
  styleUrl: './authbundle-list.component.css',
})
export class AuthbundleListComponent implements OnInit {
  noteService = inject(NoteService);
  messageService = inject(MessageService);
  apiService = inject(ApiService);
  router = inject(Router);

  visibleDialog: boolean = false;
  authbundleList: Authbundle[] = [];
  selectedAuthbundle: Authbundle[] = [];
  totalRecords!: number;
  authbundleid = '';

  showMessage: boolean = false;

  columnList: ITableColumn[] = [
    {
      fieldName: 'authbundle_id',
      headerName: 'Authbundle ID',
      routePage: (row: any) =>
        `/authbundles/authbundle-detail/${row.authbundle_id}`,
    },
    {
      fieldName: 'connector_type',
      headerName: 'Type',
    },
    {
      fieldName: 'description',
      headerName: 'Description',
    },
  ];

  menubarItems: MenuItem[] = [
    {
      routerLink: '/authbundles/authbundle-create',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create authbundle',
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

  constructor() {}

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.loadAuthbundles();
  }

  loadAuthbundles() {
    this.apiService.authbundleList().subscribe((resp) => {
      if (resp.length === 0) {
        this.showMessage = !this.showMessage;
      } else {
        this.authbundleList = resp;
      }
    });
  }

  showDialog() {
    if (this.selectedAuthbundle.length === 0) {
      this.noteService.handleWarning('No channels selected!');
      return;
    }
    this.visibleDialog = true;
  }

  onDeleteAuthbundle() {
    let observables: Observable<any>[] = [];
    this.selectedAuthbundle.map((authbundle) => {
      observables.push(
        this.apiService
          .authbundleDelete(authbundle.authbundle_id)
          .pipe(catchError((err) => {
            this.noteService.handleError(err);
            return of(true)
          })),
      );
    });

    forkJoin(observables).subscribe({
      next: (response: any) => {
        this.visibleDialog = false;
        this.selectedAuthbundle = [];
        this.loadAuthbundles();
      },
      error: (response: any) => {
        this.visibleDialog = false;
        this.selectedAuthbundle = [];
        this.loadAuthbundles();
      },
    });
  }
}
