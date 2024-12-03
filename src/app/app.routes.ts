import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
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
    canActivate: [AuthGuard],
    component: LoginComponent,
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/user/user-list/user-list.component').then(
        (r) => r.UserListComponent,
      ),
  },
  {
    path: 'user-create',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/user/user-create/user-create.component').then(
        (r) => r.UserCreateComponent,
      ),
  },
  {
    path: 'user-delete',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/user/user-delete/user-delete.component').then(
        (r) => r.UserDeleteComponent,
      ),
  },
  {
    path: 'channels',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/channel/channels.routes').then(
        (r) => r.CHANNELS_ROUTES,
      ),
  },
  {
    path: 'pipelines',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/pipeline/pipelines.routes').then(
        (r) => r.PIPELINES_ROUTES,
      ),
  },
  {
    path: 'authbundles',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/authbundle/authbundles.routes').then(
        (r) => r.AUTHBUNDLES_ROUTES,
      ),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/settings/settings.routes').then(
        (r) => r.SETTINGS_ROUTES,
      ),
  },
  {
    path: 'status',
    canActivate: [AuthGuard],
    component: StatusComponent,
  },
];
