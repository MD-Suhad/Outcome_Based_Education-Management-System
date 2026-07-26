import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 400:
          handleBadRequest(error, notificationService);
          break;
        case 401:
          handleUnauthorized(authService, router);
          break;
        case 403:
          notificationService.error('Access denied. You do not have permission to perform this action.');
          break;
        case 404:
          notificationService.error('Resource not found.');
          break;
        case 409:
          notificationService.error('Conflict. This resource already exists.');
          break;
        case 500:
          notificationService.error('Server error. Please try again later.');
          break;
        case 0:
          notificationService.error('Network error. Please check your connection.');
          break;
        default:
          notificationService.error('An unexpected error occurred. Please try again.');
      }

      return throwError(() => error);
    })
  );
};

/**
 * Handle 400 Bad Request errors
 */
function handleBadRequest(error: HttpErrorResponse, notificationService: NotificationService): void {
  const errorBody = error.error;
  
  if (errorBody?.errors && Array.isArray(errorBody.errors)) {
    errorBody.errors.forEach((err: any) => {
      notificationService.error(err.message || err);
    });
  } else if (errorBody?.message) {
    notificationService.error(errorBody.message);
  } else {
    notificationService.error('Invalid request. Please check your input.');
  }
}

/**
 * Handle 401 Unauthorized errors
 */
function handleUnauthorized(authService: AuthService, router: Router): void {
  authService.logout();
  router.navigate(['/auth/login']);
}
