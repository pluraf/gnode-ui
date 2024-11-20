import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { AuthbundleListComponent } from './authbundle-list/authbundle-list.component';
import { AuthbundleDetailComponent } from './authbundle-detail/authbundle-detail.component';
import { AuthbundleCreateComponent } from './authbundle-create/authbundle-create.component';
import { AuthbundleEditComponent } from './authbundle-edit/authbundle-edit.component';
import { AuthbundleDeleteComponent } from './authbundle-delete/authbundle-delete.component';

export const AUTHBUNDLES_ROUTES: Routes = [
  { path: '', component: AuthbundleListComponent, canActivate: [authGuard] },
  {
    path: 'authbundle-create',
    canActivate: [authGuard],
    component: AuthbundleCreateComponent,
  },
  {
    path: 'authbundle-detail/:authbundleId',
    canActivate: [authGuard],
    component: AuthbundleDetailComponent,
  },
  {
    path: 'authbundle-edit/:authbundleId',
    canActivate: [authGuard],
    component: AuthbundleEditComponent,
  },

  {
    path: 'authbundle-delete',
    canActivate: [authGuard],
    component: AuthbundleDeleteComponent,
  },
];
