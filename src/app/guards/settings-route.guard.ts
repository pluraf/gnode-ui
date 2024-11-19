import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { ApiinfoService } from '../services/apiinfo.service';
import { Router } from '@angular/router';
import { SettingsService } from '../services/settings.service';

export const SettingsRouteGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const apiInfoService = inject(ApiinfoService);
  const router = inject(Router);
  const settingsService = inject(SettingsService);

  const apiInfo = apiInfoService.getCurrentApiInfo();
  const settings = settingsService.getCurrentSettings();
  if (apiInfo?.mode === 'virtual') {
    router.navigateByUrl('/channels');
    return false;
  }
  /* if (
    settings?.authentication === false &&
    route.routeConfig?.path === 'login'
  ) {
    router.navigateByUrl('/channels');
    return false;
  } */
  return true;
};
