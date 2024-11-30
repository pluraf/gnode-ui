import { Routes } from '@angular/router';
import { MqttChannelsComponent } from './mqtt-channels/mqtt-channels.component';
import { GCloudComponent } from './g-cloud/g-cloud.component';
import { GTimeComponent } from './g-time/g-time.component';
import { NetworkSettingsComponent } from './network-settings/network-settings.component';
import { AuthenticationComponent } from './authentication/authentication.component';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: MqttChannelsComponent,
  },
  {
    path: 'gtime',
    component: GTimeComponent,
  },
  {
    path: 'gcloud',
    component: GCloudComponent,
  },
  {
    path: 'network',
    component: NetworkSettingsComponent,
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
  },
];
