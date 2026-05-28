import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const usuarioRaw = localStorage.getItem('usuario');
  console.log('interceptor — usuarioRaw:', usuarioRaw);

  if (!usuarioRaw) {
    return next(req);
  }

  try {
    const parsed = JSON.parse(usuarioRaw);
    console.log('interceptor — parsed:', parsed);
    console.log('interceptor — token:', parsed.token);

    const token = parsed.token;

    if (!token) {
      return next(req);
    }

    const reqComToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(reqComToken);
  } catch (e) {
    console.error('interceptor — erro ao parsear:', e);
    return next(req);
  }
};
