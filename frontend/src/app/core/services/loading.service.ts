import { Injectable } from '@angular/core';
import { loadingSignal, pageLoadingSignal } from '../state/global.signals';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  
  /**
   * Set global loading state
   */
  setLoading(value: boolean): void {
    loadingSignal.set(value);
  }

  /**
   * Set page loading state
   */
  setPageLoading(value: boolean): void {
    pageLoadingSignal.set(value);
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return loadingSignal();
  }

  /**
   * Check if page is loading
   */
  isPageLoading(): boolean {
    return pageLoadingSignal();
  }

  /**
   * Execute function with loading indicator
   */
  async withLoading<T>(fn: () => Promise<T>): Promise<T> {
    try {
      this.setLoading(true);
      return await fn();
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Execute function with page loading indicator
   */
  async withPageLoading<T>(fn: () => Promise<T>): Promise<T> {
    try {
      this.setPageLoading(true);
      return await fn();
    } finally {
      this.setPageLoading(false);
    }
  }
}
