import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window === 'undefined') {
    return next(req);
  }

  const usuario = localStorage.getItem('usuario');

  if (!usuario) {
    return next(req);
  }

  const token = JSON.parse(usuario).token;

  if (!token) {
    return next(req);
  }

  const reqComToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(reqComToken);
};
