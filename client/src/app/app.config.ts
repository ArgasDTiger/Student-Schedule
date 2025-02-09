import {ApplicationConfig, inject, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideApollo} from "apollo-angular";
import {HttpLink } from "apollo-angular/http";
import { InMemoryCache } from '@apollo/client/core';
import {environment} from "../environments/environment";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideToastr} from "ngx-toastr";
import {CustomToast} from "./shared/custom-toast/custom-toast.component";
import {GoogleLoginProvider, SocialAuthServiceConfig} from "@abacritt/angularx-social-login";
import {authInterceptor} from "./core/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,
      toastComponent: CustomToast
    }),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.clientId),
          },
        ]
      } as SocialAuthServiceConfig,
    },
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({
          uri: environment.graphqlUrl,
          withCredentials: true
        }),
        cache: new InMemoryCache(),
        ssrMode: true,
      };
    }),
  ]
};
