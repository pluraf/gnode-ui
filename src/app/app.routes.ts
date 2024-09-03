import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { ConnectorDetailComponent } from './components/connectors/connector-detail/connector-detail.component';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { ConnectorEditComponent } from './components/connectors/connector-edit/connector-edit.component';
import { ConnectorCreateComponent } from './components/connectors/connector-create/connector-create.component';
import { ConnectorListComponent } from './components/connectors/connector-list/connector-list.component';
import { UserListComponent } from './components/users/user-list/user-list.component';

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
  },
  {
    path: 'user-create',
    component: CreateUserComponent,
  },
  {
    path: 'connectors',
    component: ConnectorListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'connector-create',
    component: ConnectorCreateComponent,
  },
  {
    path: 'connector/:connid',
    component: ConnectorDetailComponent,
  },
  {
    path: 'connector-edit',
    component: ConnectorEditComponent,
  },
];
