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
        router.navigate(['/channels']);
        return of(false);
      }
    } else if (settingsSignal.authentication === false) {
      if (
        state.url === '/login' ||
        state.url === '/users' ||
        state.url === '/user-create' ||
        state.url === '/user-delete'
      ) {
        router.navigate(['/channels']);
        return of(false);
      }
    }
    return of(true);
  }

  if (state.url === "/login") {
    return of(true);
  } else {
    history.replaceState(null, "", "/login") // Give user a chance to go back
    router.navigate(['/login'], {'state': {'from': state.url}});
    return of(false);
  }
};
