import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';
import { ApiinfoService } from '../services/apiinfo.service';
import { map, Observable, of, take } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const settingsService = inject(SettingsService);
  const apiInfoService = inject(ApiinfoService);
  const apiInfoSignal = apiInfoService.apiInfoData();

  const settingsSignal = settingsService.settingsdata();

  if (authService.isLoggedIn()) {
    if (apiInfoSignal.mode === 'virtual') {
      if (
        state.url === '/settings/g-cloud' ||
        state.url === '/settings/g-time' ||
        state.url === '/settings/network-settings'
      ) {
        router.navigateByUrl('/channels');
        return of(false);
      }
    } else if (settingsSignal.authentication === false) {
      if (
        state.url === '/login' ||
        state.url === '/users' ||
        state.url === '/user-create' ||
        state.url === '/user-delete'
      ) {
        router.navigateByUrl('/channels');
        return of(false);
      }
    }
    return of(true);
  }

  router.navigate(['/login']);
  return of(false);
};
