import {ApplicationConfig, inject, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient} from "@angular/common/http";
import {provideApollo} from "apollo-angular";
import {HttpLink } from "apollo-angular/http";
import { InMemoryCache } from '@apollo/client/core';
import {environment} from "../environments/environment";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideToastr} from "ngx-toastr";
import {CustomToast} from "./shared/custom-toast/custom-toast.component";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,
      toastComponent: CustomToast
    }),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({ uri: environment.graphqlUrl }),
        cache: new InMemoryCache(),
        ssrMode: true,
      };
    }),
  ]
};
