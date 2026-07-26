import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Skip showing loading for certain endpoints
  if (shouldSkipLoading(req.url)) {
    return next(req);
  }

  loadingService.setLoading(true);

  return next(req).pipe(
    tap(() => {
      loadingService.setLoading(false);
    }),
    tap({
      error: () => {
        loadingService.setLoading(false);
      }
    })
  );
};

/**
 * Check if endpoint should skip loading indicator
 */
function shouldSkipLoading(url: string): boolean {
  const skipEndpoints = [
    '/api/notifications',
    '/api/health',
    '/api/ping'
  ];
  return skipEndpoints.some(endpoint => url.includes(endpoint));
}
