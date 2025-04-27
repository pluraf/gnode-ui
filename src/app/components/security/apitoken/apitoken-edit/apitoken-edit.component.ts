import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';

import { SubheaderComponent } from '../../../subheader/subheader.component';
import { ApitokenComponent, Apitoken } from '../apitoken';
import { ApiService } from '../../../../services/api.service';
import { NoteService } from '../../../../services/note.service';
import { DeleteComponent } from '../../../shared/delete/delete.component';


@Component({
  selector: 'app-apitoken-edit',
  standalone: true,
  imports: [
    SubheaderComponent,
    DeleteComponent,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    InputNumberModule,
  ],
  templateUrl: './apitoken-edit.component.html',
  styleUrl: '../apitoken.css',
})
export class  ApitokenEditComponent extends ApitokenComponent {
  apiService = inject(ApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  messageService = inject(MessageService);
  noteService = inject(NoteService);

  menubarItems: MenuItem[] = [];
  visibleDialog: boolean = false;

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  ngOnInit(){
    this.apitoken.id = this.route.snapshot.params['apitokenId'];
    this.apiService.apitokenGet(this.apitoken.id).subscribe((response: any) => {
      this.apitoken.duration = (response.till ? response.till - response.created: 0) / 86400,
      this.apitoken.description = response.description;
      this.apitoken.state = response.state;
      this.apitoken.till = new Date(response.till * 1000);
      this.apitoken.created = response.created;
      this.apitoken.token = response.token;
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

  onDelete() {
    this.apiService.apitokenDelete(this.apitoken.id).subscribe({
      next: (response: any) => {
        this.visibleDialog = false;
        this.router.navigateByUrl('/apitokens');
      },
    });
  }

  onSubmit() {
    const payload = {
      'description': this.apitoken.description,
      'state': this.apitoken.state,
      'duration': this.apitoken.duration
    }

    this.apiService.apitokenUpdate(this.apitoken.id, payload).subscribe({
      next: (response) => {
        this.noteService.handleInfo(
          'Apitoken updated successfully!',
        );
      },
      error: (response) => {
        this.noteService.handleError(response);
      }
    });
  }

}
