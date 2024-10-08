import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
/* import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserCreateComponent } from './components/user/user-create/user-create.component';
import { UserDeleteComponent } from './components/user/user-delete/user-delete.component';
import { ChannelEditComponent } from './components/channel/channel-edit/channel-edit.component';
import { ChannelDetailComponent } from './components/channel/channel-detail/channel-detail.component';
import { ChannelCreateComponent } from './components/channel/channel-create/channel-create.component';
import { ChannelListComponent } from './components/channel/channel-list/channel-list.component';
import { ChannelDeleteComponent } from './components/channel/channel-delete/channel-delete.component';
import { PipelineCreateComponent } from './components/pipeline/pipeline-create/pipeline-create.component';
import { PipelineListComponent } from './components/pipeline/pipeline-list/pipeline-list.component';
import { PipelineEditComponent } from './components/pipeline/pipeline-edit/pipeline-edit.component';
import { AuthbundleListComponent } from './components/authbundle/authbundle-list/authbundle-list.component';
import { AuthbundleCreateComponent } from './components/authbundle/authbundle-create/authbundle-create.component';
import { AuthbundleDeleteComponent } from './components/authbundle/authbundle-delete/authbundle-delete.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PipelineDeleteComponent } from './components/pipeline/pipeline-delete/pipeline-delete.component';
import { PipelineDetailComponent } from './components/pipeline/pipeline-detail/pipeline-detail.component';
import { AuthbundleDetailComponent } from './components/authbundle/authbundle-detail/authbundle-detail.component';
import { AuthbundleEditComponent } from './components/authbundle/authbundle-edit/authbundle-edit.component'; */

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
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./components/user/user-list/user-list.component').then(
        (m) => m.UserListComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'user-create',
    loadComponent: () =>
      import('./components/user/user-create/user-create.component').then(
        (m) => m.UserCreateComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'user-delete',
    loadComponent: () =>
      import('./components/user/user-delete/user-delete.component').then(
        (m) => m.UserDeleteComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'channels',
    loadComponent: () =>
      import('./components/channel/channel-list/channel-list.component').then(
        (m) => m.ChannelListComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'channel-create',
    loadComponent: () =>
      import(
        './components/channel/channel-create/channel-create.component'
      ).then((m) => m.ChannelCreateComponent),
    canActivate: [authGuard],
  },

  {
    path: 'channel/:chanid',
    loadComponent: () =>
      import(
        './components/channel/channel-detail/channel-detail.component'
      ).then((m) => m.ChannelDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'channel-edit/:chanid',
    loadComponent: () =>
      import('./components/channel/channel-edit/channel-edit.component').then(
        (m) => m.ChannelEditComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'channel-delete',
    loadComponent: () =>
      import(
        './components/channel/channel-delete/channel-delete.component'
      ).then((m) => m.ChannelDeleteComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pipelines',
    loadComponent: () =>
      import(
        './components/pipeline/pipeline-list/pipeline-list.component'
      ).then((m) => m.PipelineListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-create',
    loadComponent: () =>
      import(
        './components/pipeline/pipeline-create/pipeline-create.component'
      ).then((m) => m.PipelineCreateComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-edit/:pipeid',
    loadComponent: () =>
      import(
        './components/pipeline/pipeline-edit/pipeline-edit.component'
      ).then((m) => m.PipelineEditComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-delete',
    loadComponent: () =>
      import(
        './components/pipeline/pipeline-delete/pipeline-delete.component'
      ).then((m) => m.PipelineDeleteComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-detail/:pipeid',
    loadComponent: () =>
      import(
        './components/pipeline/pipeline-detail/pipeline-detail.component'
      ).then((m) => m.PipelineDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'authbundles',
    loadComponent: () =>
      import(
        './components/authbundle/authbundle-list/authbundle-list.component'
      ).then((m) => m.AuthbundleListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-create',
    loadComponent: () =>
      import(
        './components/authbundle/authbundle-create/authbundle-create.component'
      ).then((m) => m.AuthbundleCreateComponent),
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-delete',
    loadComponent: () =>
      import(
        './components/authbundle/authbundle-delete/authbundle-delete.component'
      ).then((m) => m.AuthbundleDeleteComponent),
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-detail/:authbundleId',
    loadComponent: () =>
      import(
        './components/authbundle/authbundle-detail/authbundle-detail.component'
      ).then((m) => m.AuthbundleDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-edit/:authbundleId',
    loadComponent: () =>
      import(
        './components/authbundle/authbundle-edit/authbundle-edit.component'
      ).then((m) => m.AuthbundleEditComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./components/settings/settings.component').then(
        (m) => m.SettingsComponent,
      ),
    canActivate: [authGuard],
  },
];
