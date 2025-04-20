import {inject, PLATFORM_ID} from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {map, take, of, Observable, timeout, catchError, tap} from 'rxjs';
import { UserService } from "../services/user.service";
import { LoadingService } from "../services/loading.service";
import { Role } from "../enums/role";
import {isPlatformBrowser} from "@angular/common";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const router = inject(Router);
  const userService = inject(UserService);
  const loadingService = inject(LoadingService);
  const platformId = inject(PLATFORM_ID);

  loadingService.setLoading(true);

  if (!isPlatformBrowser(platformId)) {
    loadingService.setLoading(false);
    return of(true);
  }

  if (userService.isInitialized) {
    const user = userService.currentUser$.getValue();
    loadingService.setLoading(false);
    return of(handleAuthLogic(user, route, state, router));
  }

  return userService.setCurrentUser().pipe(
    take(1),
    timeout(10000),
    catchError(error => {
      loadingService.setLoading(false);

      const canActivate = state.url.includes('/login');
      if (!canActivate) {
        router.navigate(['/login']);
      }
      return of(canActivate);
    }),
    map(user => {
      loadingService.setLoading(false);
      const result = handleAuthLogic(user, route, state, router);
      return result;
    })
  );
};

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
  return true;
}

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
