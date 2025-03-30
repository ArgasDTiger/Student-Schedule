import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, take, switchMap, of, Observable, filter, timeout, catchError } from 'rxjs';
import { AuthService } from "../services/auth.service";
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

  // Set global loading state
  loadingService.setLoading(true);

  // Check if user is already loaded and initialized
  if (userService.isInitialized) {
    const user = userService.currentUser$.getValue();
    loadingService.setLoading(false);
    return of(handleAuthLogic(user, route, state, router));
  }

  // If not initialized, trigger the user loading and wait for it to complete
  // Don't return any navigation decision until we have definitive information
  return new Observable<boolean>(observer => {
    // First try to get the current user
    userService.setCurrentUser();

    // Subscribe to changes in both the user and loading state
    const subscription = userService.currentUser$.pipe(
      // Only proceed when initialization is complete
      filter(() => userService.isInitialized),
      take(1),
      timeout(10000), // Set a reasonable timeout
      catchError(error => {
        console.error('Error in auth guard:', error);
        loadingService.setLoading(false);

        // On error, only allow access to login page
        const canActivate = state.url.includes('/login');
        if (!canActivate) {
          router.navigate(['/login']);
        }
        return of(canActivate);
      })
    ).subscribe(user => {
      loadingService.setLoading(false);
      const user_value = userService.currentUser$.getValue();
      const result = handleAuthLogic(user_value, route, state, router);
      observer.next(result);
      observer.complete();
      subscription.unsubscribe();
    });

    // Cleanup function if the guard is cancelled
    return () => {
      loadingService.setLoading(false);
      subscription.unsubscribe();
    };
  });
};

// Helper function to get appropriate route based on user role
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

// Extracted logic to handle authentication decisions
function handleAuthLogic(user: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot, router: Router): boolean {
  // For login page, redirect to appropriate dashboard if user is already logged in
  if (state.url.includes('/login') && user) {
    router.navigate([getRoleBasedRoute(user.role)]);
    return false;
  }

  // If user is not logged in, always redirect to login except for login page itself
  if (!user) {
    if (!state.url.includes('/login')) {
      router.navigate(['/login']);
    }
    return state.url.includes('/login');
  }

  // Role-based access control
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
