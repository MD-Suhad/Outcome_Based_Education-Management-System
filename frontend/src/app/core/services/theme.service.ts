import { Injectable } from '@angular/core';
import { darkModeSignal } from '../state/global.signals';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  
  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    darkModeSignal.update(value => !value);
  }

  /**
   * Set dark mode
   */
  setDarkMode(isDark: boolean): void {
    darkModeSignal.set(isDark);
  }

  /**
   * Check if dark mode is enabled
   */
  isDarkMode(): boolean {
    return darkModeSignal();
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): 'light' | 'dark' {
    return darkModeSignal() ? 'dark' : 'light';
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme: 'light' | 'dark'): void {
    const isDark = theme === 'dark';
    darkModeSignal.set(isDark);
  }
}
