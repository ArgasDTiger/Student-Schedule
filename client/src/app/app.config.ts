import {ApplicationConfig, inject, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideApollo} from "apollo-angular";
import {HttpLink } from "apollo-angular/http";
import {InMemoryCache, split} from '@apollo/client/core';
import {environment} from "../environments/environment";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideToastr} from "ngx-toastr";
import {CustomToast} from "./shared/custom-toast/custom-toast.component";
import {GoogleLoginProvider, SocialAuthServiceConfig} from "@abacritt/angularx-social-login";
import {authInterceptor} from "./core/interceptors/auth.interceptor";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {createClient} from "graphql-ws";
import {addTypenameToDocument, getMainDefinition} from "@apollo/client/utilities";
import {Kind, OperationTypeNode} from "graphql/language";
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

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
      const platformId = inject(PLATFORM_ID);

      const http = httpLink.create({
        uri: environment.graphqlUrl,
        withCredentials: true
      });

      if (isPlatformBrowser(platformId)) {
        const ws = new GraphQLWsLink(
          createClient({
            url: environment.graphqlWsUrl
          }),
        );

        const link = split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === Kind.OPERATION_DEFINITION &&
              definition.operation === OperationTypeNode.SUBSCRIPTION
            );
          },
          ws,
          http,
        );

        return {
          link,
          cache: new InMemoryCache({
            addTypename: false
          })
        };
      }

      return {
        link: http,
        cache: new InMemoryCache(),
        ssrMode: true,
      };
    }),
  ]
};
