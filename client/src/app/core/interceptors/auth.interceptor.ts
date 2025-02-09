import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { from, switchMap, throwError, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { graphqlCode } from "../constants/graphl-codes";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const maxRetries = 1;
  let retryCount = 0;

  const handleResponse = (response: any): Observable<any> => {
    const body = response.body;

    if (body?.errors) {
      const authError = body.errors.find(
        (e: any) => e.extensions?.code === graphqlCode.unauthorized
      );

      if (authError) {
        if (retryCount < maxRetries) {
          retryCount++;
          return from(authService.refreshToken()).pipe(
            switchMap(tokenRefreshed => {
              if (tokenRefreshed) {
                return next(req);
              } else {
                return from(router.navigate(['/login'])).pipe(
                  switchMap(() => throwError(() => response))
                );
              }
            })
          );
        } else {
          return from(router.navigate(['/login'])).pipe(
            switchMap(() => throwError(() => response))
          );
        }
      }
    }

    return new Observable(observer => {
      observer.next(response);
      observer.complete();
    });
  };

  return next(req).pipe(
    switchMap(response => handleResponse(response))
  );
};
