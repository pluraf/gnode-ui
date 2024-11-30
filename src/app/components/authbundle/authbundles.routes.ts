import { Routes } from '@angular/router';
import { AuthbundleListComponent } from './authbundle-list/authbundle-list.component';
import { AuthbundleDetailComponent } from './authbundle-detail/authbundle-detail.component';
import { AuthbundleCreateComponent } from './authbundle-create/authbundle-create.component';
import { AuthbundleEditComponent } from './authbundle-edit/authbundle-edit.component';
import { AuthbundleDeleteComponent } from './authbundle-delete/authbundle-delete.component';

export const AUTHBUNDLES_ROUTES: Routes = [
  {
    path: '',
    component: AuthbundleListComponent
  },
  {
    path: 'authbundle-create',
    component: AuthbundleCreateComponent,
  },
  {
    path: 'authbundle-detail/:authbundleId',
    component: AuthbundleDetailComponent,
  },
  {
    path: 'authbundle-edit/:authbundleId',
    component: AuthbundleEditComponent,
  },

  {
    path: 'authbundle-delete',
    component: AuthbundleDeleteComponent,
  },
];
