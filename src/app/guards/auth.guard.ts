import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, delay, tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { InfoService } from '../services/info.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  router = inject(Router);
  authService = inject(AuthService);
  infoService = inject(InfoService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.infoService.loadBasics().pipe(
        map((data: any) => {
          return this.check(state, data);
        })
      );
  }

  private check(state: RouterStateSnapshot, data: any): boolean {
    if (state.url === "/login" && this.infoService.infoData().anonymous) {
      this.router.navigate(['/']);
      return false;
    }

    if (this.authService.isLoggedIn() || this.infoService.infoData().anonymous) {
      this.infoService.loadInfo();
      return true;
    }

    if (state.url === "/login") {
      return true;
    } else {
      history.replaceState(null, "", "/login") // Give user a chance to go back
      this.router.navigate(['/login'], {'state': {'from': state.url}});
      return false;
    }
  }
};
