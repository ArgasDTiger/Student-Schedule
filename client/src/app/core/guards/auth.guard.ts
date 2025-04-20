import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, take, of, Observable, timeout, catchError } from 'rxjs';
import { UserService } from "../services/user.service";
import { LoadingService } from "../services/loading.service";
import { Role } from "../enums/role";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const router = inject(Router);
  const userService = inject(UserService);
  const loadingService = inject(LoadingService);

  loadingService.setLoading(true);

  // Check if user is already loaded and initialized
  if (userService.isInitialized) {
    const user = userService.currentUser$.getValue();
    loadingService.setLoading(false);
    return of(handleAuthLogic(user, route, state, router));
  }

  return userService.setCurrentUser().pipe(
    take(1),
    timeout(10000),
    catchError(error => {
      console.error('Error in auth guard:', error);
      loadingService.setLoading(false);

      const canActivate = state.url.includes('/login');
      if (!canActivate) {
        router.navigate(['/login']);
      }
      return of(canActivate);
    }),
    map(user => {
      loadingService.setLoading(false);
      return handleAuthLogic(user, route, state, router);
    })
  );
};

function getRoleBasedRoute(role: Role): string {
  switch(role) {
    case Role.Admin:
      return '/admin';
    case Role.Moderator:
      return '/moderator';
    case Role.Student:
      return '/student';
    default:
      return '/login';
  }
}

function handleAuthLogic(user: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot, router: Router): boolean {
  if (state.url.includes('/login') && user) {
    router.navigate([getRoleBasedRoute(user.role)]);
    return false;
  }

  if (!user) {
    if (!state.url.includes('/login')) {
      router.navigate(['/login']);
    }
    return state.url.includes('/login');
  }

  if (state.url.includes('/admin') && user.role !== Role.Admin) {
    router.navigate([getRoleBasedRoute(user.role)]);
    return false;
  }

  if (state.url.includes('/moderator') && user.role !== Role.Moderator && user.role !== Role.Admin) {
    router.navigate([getRoleBasedRoute(user.role)]);
    return false;
  }

  if (state.url.includes('/student') && user.role !== Role.Student && user.role !== Role.Moderator && user.role !== Role.Admin) {
    router.navigate(['/login']);
    return false;
  }

  return true;
}
