import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  const localData = sessionStorage.getItem('token');
 /*  console.log('Auth Guard triggered. Token:', localData); */
  if (localData) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
