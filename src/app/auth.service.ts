import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {
  getToken() {
    return this.cookieService.get('Logs_Cookie_data');
  }

  isLoggednIn(): boolean {
    const token = this.getToken();
    return !!token && token.trim().length > 0;
  }

  constructor(private cookieService: CookieService) {}
}
