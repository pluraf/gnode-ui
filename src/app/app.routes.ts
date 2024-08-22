import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { DeviceComponent } from './device/device.component';
import { DeviceDetailComponent } from './device/device-detail/device-detail.component';
import { DevicesCreateComponent } from './device/devices-create/devices-create.component';

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
    path: 'register',
    component: RegisterComponent,
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
];
