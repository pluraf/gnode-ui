import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { ConnectorDetailComponent } from './components/connectors/connector-detail/connector-detail.component';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { ConnectorEditComponent } from './components/connectors/connector-edit/connector-edit.component';
import { ConnectorCreateComponent } from './components/connectors/connector-create/connector-create.component';
import { ConnectorListComponent } from './components/connectors/connector-list/connector-list.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { ConnectorDeleteComponent } from './components/connectors/connector-delete/connector-delete.component';
import { PublicKeyComponent } from './components/public-key/public-key.component';
import { PipelineCreateComponent } from './components/pipelines/pipeline-create/pipeline-create.component';
import { PipelineListComponent } from './components/pipelines/pipeline-list/pipeline-list.component';
import { PipelineEditComponent } from './components/pipelines/pipeline-edit/pipeline-edit.component';

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
    component: CreateUserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'connectors',
    component: ConnectorListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'connector-create',
    component: ConnectorCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'connector/:connid',
    component: ConnectorDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'connector-edit/:connid',
    component: ConnectorEditComponent,
    canActivate: [authGuard],
  },
  {
    path: 'connector-delete',
    component: ConnectorDeleteComponent,
    canActivate: [authGuard],
  },
  {
    path: 'publickey',
    component: PublicKeyComponent,
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
    path: 'pipeline-edit',
    component: PipelineEditComponent,
    canActivate: [authGuard],
  },
];
