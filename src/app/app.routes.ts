import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { UserListComponent } from './components/user/user-list/user-list.component';
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
import { AuthbundleEditComponent } from './components/authbundle/authbundle-edit/authbundle-edit.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user-create',
    component: UserCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user-delete',
    component: UserDeleteComponent,
    canActivate: [authGuard],
  },
  {
    path: 'channels',
    component: ChannelListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'channel-create',
    component: ChannelCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'channel/:chanid',
    component: ChannelDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'channel-edit/:chanid',
    component: ChannelEditComponent,
    canActivate: [authGuard],
  },
  {
    path: 'channel-delete',
    component: ChannelDeleteComponent,
    canActivate: [authGuard],
  },
  {
    path: 'pipelines',
    component: PipelineListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-create',
    component: PipelineCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-edit/:pipeid',
    component: PipelineEditComponent,
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-delete',
    component: PipelineDeleteComponent,
    canActivate: [authGuard],
  },
  {
    path: 'pipeline-detail/:pipeid',
    component: PipelineDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'authbundles',
    component: AuthbundleListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-create',
    component: AuthbundleCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-delete',
    component: AuthbundleDeleteComponent,
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-detail/:authbundleId',
    component: AuthbundleDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'authbundle-edit/:authbundleId',
    component: AuthbundleEditComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard],
  },
];
