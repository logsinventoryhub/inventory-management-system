import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CommunicatorService } from './communicator.service';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), CommunicatorService, provideRouter(routes), provideClientHydration(), provideAnimations(), provideHttpClient(withFetch()), AuthGuard, CookieService, AuthService]
};
