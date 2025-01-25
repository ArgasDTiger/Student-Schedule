import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import {provideHttpClient, withFetch} from "@angular/common/http";
import {provideClientHydration, withHttpTransferCacheOptions} from "@angular/platform-browser";

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideClientHydration(withHttpTransferCacheOptions({
      includePostRequests: true,
    })),
    provideHttpClient(withFetch()),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
