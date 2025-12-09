import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { StatusComponent } from './components/status/status.component';
import { LoginComponent } from './components/login/login.component';
import { ExternalComponent } from './components/external/external.component';
import { DashboardContainerComponent } from './components/dashboard-container/dashboard-container.component';


function dashboardMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length > 0 && segments[0].path === 'dashboard') {
    return {
      consumed: segments,
      posParams: {}
    };
  }
  return null;
}


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'channels',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    component: LoginComponent,
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/user/user-list/user-list.component').then(
        (c) => c.UserListComponent,
      ),
  },
  {
    path: 'user-create',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/user/user-create/user-create.component').then(
        (c) => c.UserCreateComponent,
      ),
  },
  {
    path: 'channels',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/channel/channels.routes').then(
        (r) => r.CHANNELS_ROUTES,
      ),
  },
  {
    path: 'devices',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/device/device.routes').then(
        (r) => r.DEVICE_ROUTES,
      ),
  },
  {
    path: 'pipelines',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/pipeline/pipelines.routes').then(
        (r) => r.PIPELINES_ROUTES,
      ),
  },
  {
    path: 'converters',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/data/converter/converter.routes').then(
        (r) => r.CONVERTER_ROUTES,
      ),
  },
  {
    path: 'authbundles',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/security/authbundle/authbundles.routes').then(
        (r) => r.AUTHBUNDLES_ROUTES,
      ),
  },
  {
    path: 'ca',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/security/ca/ca.routes').then(
        (r) => r.CA_ROUTES,
      ),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/settings/settings.routes').then(
        (r) => r.SETTINGS_ROUTES,
      ),
  },
  {
    matcher: dashboardMatcher,
    canActivate: [AuthGuard],
    component: DashboardContainerComponent,
  },
  {
    path: 'status',
    canActivate: [AuthGuard],
    component: StatusComponent,
  },
  {
    path: 'apitokens',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./components/security/apitoken/apitoken.routes').then(
        (r) => r.APITOKEN_ROUTES,
      ),
  },
  {
    path: 'external/chirpstack',
    canActivate: [AuthGuard],
    component: ExternalComponent,
  }
];
