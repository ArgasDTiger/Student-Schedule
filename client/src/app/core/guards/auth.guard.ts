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

  // Check if we're on the login page
  const isLoginPage = state.url.includes('/login');

  // For server-side rendering, just pass through
  if (!isPlatformBrowser(platformId)) {
    return of(true);
  }

  // If user is already initialized, handle quickly
  if (userService.isInitialized) {
    const user = userService.currentUser$.getValue();
    return of(handleAuthLogic(user, route, state, router));
  }

  // Only show loading if not on login page or if we need to fetch user data
  loadingService.setLoading(true);

  return userService.setCurrentUser().pipe(
    take(1),
    timeout(5000), // Reduced timeout from 10s to 5s
    catchError(error => {
      loadingService.setLoading(false);

      // If login page, allow access
      if (isLoginPage) {
        return of(true);
      }

      // Otherwise redirect to login
      router.navigate(['/login']);
      return of(false);
    }),
    map(user => {
      loadingService.setLoading(false);
      return handleAuthLogic(user, route, state, router);
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
