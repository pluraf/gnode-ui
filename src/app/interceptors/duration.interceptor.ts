import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { SpinnerService } from '../services/spinner.service';


export const durationInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);
    spinnerService.start();
    return next(req).pipe(
      finalize(() => {spinnerService.stop();})
    );
};
