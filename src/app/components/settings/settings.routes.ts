import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { MqttChannelsComponent } from './mqtt-channels/mqtt-channels.component';
import { GCloudComponent } from './g-cloud/g-cloud.component';
import { GTimeComponent } from './g-time/g-time.component';
import { NetworkSettingsComponent } from './network-settings/network-settings.component';
import { AuthenticationComponent } from './authentication/authentication.component';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: MqttChannelsComponent,
  },
  {
    path: 'g-cloud',
    canActivate: [authGuard],
    component: GCloudComponent,
  },
  {
    path: 'g-time',
    canActivate: [authGuard],
    component: GTimeComponent,
  },
  {
    path: 'network-settings',
    canActivate: [authGuard],
    component: NetworkSettingsComponent,
  },
  {
    path: 'authentication',
    canActivate: [authGuard],
    component: AuthenticationComponent,
  },
];
