import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = performance.now();

  return next(req).pipe(
    tap({
      next: (response: any) => {
        const duration = performance.now() - startTime;
        console.log(`%c[${req.method}] ${req.url}`, 'color: green', {
          status: response.status,
          duration: `${duration.toFixed(2)}ms`
        });
      },
      error: (error: any) => {
        const duration = performance.now() - startTime;
        console.error(`%c[${req.method}] ${req.url}`, 'color: red', {
          status: error.status,
          duration: `${duration.toFixed(2)}ms`,
          error: error.message
        });
      }
    })
  );
};
