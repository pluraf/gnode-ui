import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { StatusComponent } from './components/status/status.component';
import { HandleMessageComponent } from './components/handle-message/handle-message.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
  /* {
    path: 'channel-create',
    loadComponent: () =>
      import(
        './components/channel/channel-create/channel-create.component'
      ).then((c) => c.ChannelCreateComponent),
    canActivate: [authGuard],
  },

  {
    path: 'channel/:chanid',
    loadComponent: () =>
      import(
        './components/channel/channel-detail/channel-detail.component'
      ).then((c) => c.ChannelDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'channel-edit/:chanid',
    loadComponent: () =>
      import('./components/channel/channel-edit/channel-edit.component').then(
        (c) => c.ChannelEditComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'channel-delete',
    loadComponent: () =>
      import(
        './components/channel/channel-delete/channel-delete.component'
      ).then((c) => c.ChannelDeleteComponent),
    canActivate: [authGuard],
  }, */
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
    loadComponent: () =>
      import('./components/settings/settings.component').then(
        (c) => c.SettingsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'status',
    component: StatusComponent,
  },
  {
    path: 'messages',
    component: HandleMessageComponent,
  },
];
