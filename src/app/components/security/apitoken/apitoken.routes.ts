import { Routes } from '@angular/router';
import { ApitokenListComponent } from './apitoken-list/apitoken-list.component';
import { ApitokenCreateComponent } from './apitoken-create/apitoken-create.component';
import { ApitokenEditComponent } from './apitoken-edit/apitoken-edit.component';


export const APITOKEN_ROUTES: Routes = [
  {
    path: '',
    component: ApitokenListComponent,
  },
  {
    path: 'apitoken-create',
    component: ApitokenCreateComponent,
  },
  {
    path: 'apitoken-edit/:apitokenId',
    component: ApitokenEditComponent,
  },
];
