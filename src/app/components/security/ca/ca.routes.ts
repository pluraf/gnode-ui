import { Routes } from '@angular/router';
import { CAListComponent } from './ca-list/ca-list.component';
import { CADetailsComponent } from './ca-detail/ca-detail.component';
import { CAAddComponent } from './ca-add/ca-add.component';
import { CAEditComponent } from './ca-edit/ca-edit.component';

export const CA_ROUTES: Routes = [
  {
    path: '',
    component: CAListComponent,
  },
  {
    path: 'ca-add',
    component: CAAddComponent,
  },
  {
    path: 'ca-detail/:caId',
    component: CADetailsComponent,
  },
  {
    path: 'ca-edit/:caId',
    component: CAEditComponent,
  },
];
