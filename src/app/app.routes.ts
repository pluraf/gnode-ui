import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { StatusComponent } from './components/status/status.component';
import { HandleMessageComponent } from './components/handle-message/handle-message.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent,
      ),
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
    loadComponent: () =>
      import('./components/channel/channel-list/channel-list.component').then(
        (c) => c.ChannelListComponent,
      ),
    canActivate: [authGuard],
  },
  {
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
  },
  {
    path: 'pipelines',
    loadComponent: () =>
      import(
        './components/pipeline/pipeline-list/pipeline-list.component'
      ).then((c) => c.PipelineListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-create',
    loadComponent: () =>
      import(
        './components/pipeline/pipeline-create/pipeline-create.component'
      ).then((c) => c.PipelineCreateComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-edit/:pipeid',
    loadComponent: () =>
      import(
        './components/pipeline/pipeline-edit/pipeline-edit.component'
      ).then((c) => c.PipelineEditComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-delete',
    loadComponent: () =>
      import(
        './components/pipeline/pipeline-delete/pipeline-delete.component'
      ).then((c) => c.PipelineDeleteComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-detail/:pipeid',
    loadComponent: () =>
      import(
        './components/pipeline/pipeline-detail/pipeline-detail.component'
      ).then((c) => c.PipelineDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'authbundles',
    loadComponent: () =>
      import(
        './components/authbundle/authbundle-list/authbundle-list.component'
      ).then((c) => c.AuthbundleListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-create',
    loadComponent: () =>
      import(
        './components/authbundle/authbundle-create/authbundle-create.component'
      ).then((c) => c.AuthbundleCreateComponent),
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-delete',
    loadComponent: () =>
      import(
        './components/authbundle/authbundle-delete/authbundle-delete.component'
      ).then((c) => c.AuthbundleDeleteComponent),
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-detail/:authbundleId',
    loadComponent: () =>
      import(
        './components/authbundle/authbundle-detail/authbundle-detail.component'
      ).then((c) => c.AuthbundleDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-edit/:authbundleId',
    loadComponent: () =>
      import(
        './components/authbundle/authbundle-edit/authbundle-edit.component'
      ).then((c) => c.AuthbundleEditComponent),
    canActivate: [authGuard],
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
