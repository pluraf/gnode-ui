import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { ChannelListComponent } from './channel-list/channel-list.component';
import { ChannelCreateComponent } from './channel-create/channel-create.component';
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { ChannelEditComponent } from './channel-edit/channel-edit.component';
import { ChannelDeleteComponent } from './channel-delete/channel-delete.component';

export const CHANNELS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: ChannelListComponent
  },
  {
    path: 'channel-create',
    canActivate: [authGuard],
    component: ChannelCreateComponent,
  },
  {
    path: 'channel/:chanid',
    canActivate: [authGuard],
    component: ChannelDetailComponent,
  },
  {
    path: 'channel-edit/:chanid',
    canActivate: [authGuard],
    component: ChannelEditComponent,
  },

  {
    path: 'channel-delete',
    canActivate: [authGuard],
    component: ChannelDeleteComponent,
  },
];
