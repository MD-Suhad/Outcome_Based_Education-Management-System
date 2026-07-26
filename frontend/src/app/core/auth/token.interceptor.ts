import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // Add Bearer token to requests (except public endpoints)
  if (token && !isPublicEndpoint(req.url)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Check if token is expired and refresh if needed
  if (token && authService.isTokenExpired()) {
    return authService.refreshAccessToken().pipe(
      switchMap(() => {
        const newToken = authService.getAccessToken();
        if (newToken) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });
        }
        return next(req);
      })
    );
  }

  return next(req);
};

/**
 * Check if endpoint is public and doesn't require authentication
 */
function isPublicEndpoint(url: string): boolean {
  const publicEndpoints = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/auth/registrar',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password'
  ];
  return publicEndpoints.some(endpoint => url.includes(endpoint));
}

