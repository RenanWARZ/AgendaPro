import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (typeof window === 'undefined') return true;

  const role = localStorage.getItem('role');

  if (role !== 'ADMIN') {
    router.navigate(['/agendamentos']);
    return false;
  }

  return true;
};
