import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _activeTheme = signal<AppTheme>('dark');
  public activeTheme = this._activeTheme.asReadonly();

  constructor() {
    const savedTheme = localStorage.getItem('obe-theme') as AppTheme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      this._activeTheme.set(savedTheme);
    } else {
      this._activeTheme.set('dark');
    }

    effect(() => {
      const theme = this._activeTheme();
      const body = document.body;
      if (theme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
      } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
      }
      localStorage.setItem('obe-theme', theme);
    });
  }

  public toggleTheme(): void {
    this._activeTheme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  public toggleDarkMode(): void {
    this.toggleTheme();
  }

  public isDarkMode(): boolean {
    return this._activeTheme() === 'dark';
  }

  public setTheme(theme: AppTheme): void {
    this._activeTheme.set(theme);
  }
}
