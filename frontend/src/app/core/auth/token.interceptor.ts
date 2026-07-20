import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');

  let headers = req.headers;

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const modifiedReq = req.clone({ headers });
  return next(modifiedReq);
};
