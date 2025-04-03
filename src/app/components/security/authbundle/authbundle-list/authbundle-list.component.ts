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

import { Authbundle } from '../authbundle';
import { SubheaderComponent } from '../../../subheader/subheader.component';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';
import { ToastModule } from 'primeng/toast';
import { DeleteComponent } from '../../../shared/delete/delete.component';

@Component({
  selector: 'app-authbundle-list',
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
  providers: [MessageService, NoteService],
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
      this.noteService.handleMessage(
        this.messageService,
        'warn',
        'No channels selected.',
      );
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
          .pipe(catchError((err) => of(true))),
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
