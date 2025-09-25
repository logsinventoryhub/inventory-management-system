import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  toggleDarkMode(enable: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-theme', enable);
      localStorage.setItem('dark-mode', enable ? 'true' : 'false');
    }
  }

  toggleTheme(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    document.body.classList.toggle('dark-theme', checked);
    localStorage.setItem('dark-mode', checked ? 'true' : 'false');
  }

  loadUserPreference() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('dark-mode') === 'true';
      this.toggleDarkMode(stored);
    }
  }
}
