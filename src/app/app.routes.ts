import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { DeviceComponent } from './components/device/device.component';
import { DeviceDetailComponent } from './components/device/device-detail/device-detail.component';
import { DevicesCreateComponent } from './components/device/devices-create/devices-create.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { StatusComponent } from './components/sidemenu/status/status.component';
import { DevicesEditComponent } from './components/device/devices-edit/devices-edit.component';

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
    path: 'device',
    component: DeviceComponent,
    canActivate: [authGuard],
  },
  {
    path: 'devices-create',
    component: DevicesCreateComponent,
  },
  {
    path: 'device-detail',
    component: DeviceDetailComponent,
  },
  {
    path: 'status',
    component: StatusComponent,
  },
  {
    path: 'device-edit',
    component: DevicesEditComponent,
  },
];
