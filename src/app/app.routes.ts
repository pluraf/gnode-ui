import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { ConnectorDetailComponent } from './components/connectors/connector-detail/connector-detail.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { StatusComponent } from './components/sidemenu/status/status.component';
import { ConnectorEditComponent } from './components/connectors/connector-edit/connector-edit.component';
import { ConnectorCreateComponent } from './components/connectors/connector-create/connector-create.component';
import { ConnectorListComponent } from './components/connectors/connector-list/connector-list.component';

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
    path: 'create-user',
    component: CreateUserComponent,
  },
  {
    path: 'connector-list',
    component: ConnectorListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'connector-create',
    component: ConnectorCreateComponent,
  },
  {
    path: 'connector-detail',
    component: ConnectorDetailComponent,
  },
  {
    path: 'status',
    component: StatusComponent,
  },
  {
    path: 'connector-edit',
    component: ConnectorEditComponent,
  },
];
