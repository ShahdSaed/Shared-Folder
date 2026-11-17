import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Async auth guard — waits for session restore if not yet authenticated.
 * This prevents a redirect to /login on page refresh while the refresh-token
 * request is still in-flight.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Fast path: already authenticated (token in memory)
  if (authService.isAuthenticated()) {
    return true;
  }

  // Slow path: try to restore session via refresh-token cookie
  return authService.tryRestoreSession().pipe(
    map((restored) => {
      if (restored || authService.isAuthenticated()) return true;
      return router.parseUrl('/login');
    }),
    catchError(() => of(router.parseUrl('/login')))
  );
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Fast path
  if (authService.isAuthenticated() && authService.isAdmin()) return true;
  if (authService.isAuthenticated()) return router.parseUrl('/shared-files');

  // Slow path: restore session first
  return authService.tryRestoreSession().pipe(
    map((restored) => {
      const ok = restored || authService.isAuthenticated();
      if (!ok) return router.parseUrl('/login');
      if (authService.isAdmin()) return true;
      return router.parseUrl('/shared-files');
    }),
    catchError(() => of(router.parseUrl('/login')))
  );
};

/** Prevents VIEWER users from accessing the Dashboard */
export const dashboardGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Fast path
  if (authService.isAuthenticated()) {
    return authService.isAdmin() ? true : router.parseUrl('/shared-files');
  }

  // Slow path: restore session first
  return authService.tryRestoreSession().pipe(
    map((restored) => {
      const ok = restored || authService.isAuthenticated();
      if (!ok) return router.parseUrl('/login');
      return authService.isAdmin() ? true : router.parseUrl('/shared-files');
    }),
    catchError(() => of(router.parseUrl('/login')))
  );
};
