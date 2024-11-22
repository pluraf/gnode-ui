import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { StatusComponent } from './components/status/status.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'channels',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./components/user/user-list/user-list.component').then(
        (c) => c.UserListComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'user-create',
    loadComponent: () =>
      import('./components/user/user-create/user-create.component').then(
        (c) => c.UserCreateComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'user-delete',
    loadComponent: () =>
      import('./components/user/user-delete/user-delete.component').then(
        (c) => c.UserDeleteComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'channels',
    loadChildren: () =>
      import('./components/channel/channels.routes').then(
        (r) => r.CHANNELS_ROUTES,
      ),
  },
  {
    path: 'pipelines',
    loadChildren: () =>
      import('./components/pipeline/pipelines.routes').then(
        (r) => r.PIPELINES_ROUTES,
      ),
  },
  {
    path: 'authbundles',
    loadChildren: () =>
      import('./components/authbundle/authbundles.routes').then(
        (r) => r.AUTHBUNDLES_ROUTES,
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./components/settings/settings.routes').then(
        (r) => r.SETTINGS_ROUTES,
      ),
  },
  {
    path: 'status',
    canActivate: [authGuard],
    component: StatusComponent,
  },
];
