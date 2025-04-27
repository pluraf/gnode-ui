import { Component, inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { forkJoin, catchError, of, Observable } from 'rxjs';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { Apitoken } from '../apitoken';
import { SubheaderComponent } from '../../../subheader/subheader.component';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';
import { ToastModule } from 'primeng/toast';
import { DeleteComponent } from '../../../shared/delete/delete.component';


@Pipe({ name: 'apitoken_state', standalone: true })
export class ApitokenStatePipe implements PipeTransform {
  transform(value: Number): string {
    if (value === 1) return 'valid';
    if (value === 3) return 'suspended';
    if (value === 5) return 'revoked';
    return '';
  }
}


@Component({
  selector: 'app-apitoken-list',
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
    ApitokenStatePipe,
  ],
  templateUrl: './apitoken-list.component.html',
  styleUrl: '../apitoken.css',
})
export class ApitokenListComponent implements OnInit {
  noteService = inject(NoteService);
  messageService = inject(MessageService);
  apiService = inject(ApiService);
  router = inject(Router);

  visibleDialog: boolean = false;
  apitokenList: Apitoken[] = [];
  selectedApitoken: Apitoken[] = [];
  totalRecords!: number;

  showMessage: boolean = false;

  menubarItems: MenuItem[] = [
    {
      routerLink: '/apitokens/apitoken-create',
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Create API Token',
      },
      iconClass: 'pi pi-plus m-1',
    },
    {
      tooltipOptions: {
        tooltipEvent: 'hover',
        tooltipPosition: 'bottom',
        tooltipLabel: 'Delete API Token',
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
    this.loadApitokens();
  }

  loadApitokens() {
    this.apiService.apitokenList().subscribe((resp) => {
      if (resp.length === 0) {
        this.showMessage = !this.showMessage;
      } else {
        this.apitokenList = [];
        resp.forEach((el: any) => {
          this.apitokenList.push({
            id: el.id,
            duration: el.till ? el.till - el.created: 0,
            state: el.state,
            token: el.token,
            created: new Date(el.created * 1000),
            till: new Date(el.till * 1000),
            description: el.description
          });
        });
      }
    });
  }

  showDialog() {
    if (this.selectedApitoken.length === 0) {
      this.noteService.handleWarning('No apitokens selected!');
      return;
    }
    this.visibleDialog = true;
  }

  onDeleteApitoken() {
    let observables: Observable<any>[] = [];
    this.selectedApitoken.map((apitoken) => {
      observables.push(
        this.apiService
          .apitokenDelete(apitoken.id)
          .pipe(catchError((err) => of(true))),
      );
    });

    forkJoin(observables).subscribe({
      next: (response: any) => {
        this.visibleDialog = false;
        this.selectedApitoken = [];
        this.loadApitokens();
      },
      error: (response: any) => {
        this.visibleDialog = false;
        this.selectedApitoken = [];
        this.loadApitokens();
      },
    });
  }
}
