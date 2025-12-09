import { Routes } from '@angular/router';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceCreateComponent } from './device-create/device-create.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { DeviceEditComponent } from './device-edit/device-edit.component';


export const DEVICE_ROUTES: Routes = [
  {
    path: '',
    component: DeviceListComponent,
  },
  {
    path: 'device-create',
    component: DeviceCreateComponent,
  },
  {
    path: 'device/:devid',
    component: DeviceDetailComponent,
  },
  {
    path: 'device-edit/:devid',
    component: DeviceEditComponent,
  },
];
