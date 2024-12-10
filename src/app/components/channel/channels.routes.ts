import { Routes } from '@angular/router';
import { ChannelListComponent } from './channel-list/channel-list.component';
import { ChannelCreateComponent } from './channel-create/channel-create.component';
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { ChannelEditComponent } from './channel-edit/channel-edit.component';

export const CHANNELS_ROUTES: Routes = [
  {
    path: '',
    component: ChannelListComponent,
  },
  {
    path: 'channel-create',
    component: ChannelCreateComponent,
  },
  {
    path: 'channel/:chanid',
    component: ChannelDetailComponent,
  },
  {
    path: 'channel-edit/:chanid',
    component: ChannelEditComponent,
  },
];
