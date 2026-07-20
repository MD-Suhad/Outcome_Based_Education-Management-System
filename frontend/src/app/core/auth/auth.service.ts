import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _accessToken = signal<string | null>(null);

  public currentUser = this._currentUser.asReadonly();
  public accessToken = this._accessToken.asReadonly();

  public isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    this.loadCachedSession();
  }

  public login(credentials: any): Observable<any> {
    return this.http.post<any>('/api/v1/auth/login', credentials).pipe(
      tap((res) => {
        if (res && res.Success && res.token) {
          const authRes: AuthResponse = {
            accessToken: res.token,
            refreshToken: ''
          };
          this.setSession(authRes);
        }
      })
    );
  }

  public register(payload: any): Observable<any> {
    return this.http.post<any>('/api/v1/auth/registrar', payload);
  }

  public logout(): void {
    this._currentUser.set(null);
    this._accessToken.set(null);
    localStorage.removeItem('access_token');
  }

  private setSession(res: AuthResponse): void {
    if (res.accessToken) {
      this._accessToken.set(res.accessToken);
      localStorage.setItem('access_token', res.accessToken);
      try {
        this._currentUser.set(this.decodeJwtClaims(res.accessToken));
      } catch (e) {
        console.error('Failed to decode token claims', e);
        this.logout();
      }
    }
  }

  private loadCachedSession(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      this._accessToken.set(token);
      try {
        this._currentUser.set(this.decodeJwtClaims(token));
      } catch {
        this.logout();
      }
    }
  }

  private decodeJwtClaims(token: string): User {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      return {
        id: decoded.sub || decoded.id,
        email: decoded.email || decoded.sub,
        firstName: decoded.firstName || decoded.name || decoded.sub,
        lastName: decoded.lastName || '',
        roles: decoded.roles || [],
        permissions: decoded.permissions || []
      };
    } catch (e) {
      throw new Error('Invalid token');
    }
  }
}
