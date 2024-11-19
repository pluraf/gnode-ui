import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../services/settings.service';

export const usersRouteGuard: CanActivateFn = (route, state) => {
  const settingsService = inject(SettingsService);
  const router = inject(Router);

  const settings = settingsService.getCurrentSettings();
  if (settings?.authentication === false) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
