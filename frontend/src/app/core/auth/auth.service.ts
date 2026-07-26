import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { 
  LoginRequest, 
  LoginResponse, 
  SignupRequest, 
  RefreshTokenRequest,
  AuthUser 
} from '../models/auth.model';
import { 
  currentUserSignal, 
  isAuthenticatedSignal, 
  authLoadingSignal,
  authErrorSignal,
  accessTokenSignal,
  refreshTokenSignal,
  userPermissionsSignal
} from '../state/global.signals';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = '/api/auth';

  private authStateSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.loadStoredAuth();
  }

  /**
   * Authenticate user with email and password
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    authLoadingSignal.set(true);
    authErrorSignal.set(null);

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.setAuthTokens(response);
        currentUserSignal.set({
          id: response.user.id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          role: response.user.role,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        userPermissionsSignal.set(response.user.permissions);
        isAuthenticatedSignal.set(true);
        authLoadingSignal.set(false);
        this.authStateSubject.next(true);
      }),
      catchError(error => {
        authErrorSignal.set(error?.error?.message || 'Login failed');
        authLoadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user
   */
  signup(request: SignupRequest): Observable<AuthUser> {
    authLoadingSignal.set(true);
    authErrorSignal.set(null);

    return this.http.post<AuthUser>(`${this.apiUrl}/register`, request).pipe(
      tap(() => {
        authLoadingSignal.set(false);
      }),
      catchError(error => {
        authErrorSignal.set(error?.error?.message || 'Signup failed');
        authLoadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshAccessToken(): Observable<LoginResponse> {
    const refreshToken = refreshTokenSignal();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, request).pipe(
      tap(response => {
        this.setAuthTokens(response);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    accessTokenSignal.set(null);
    refreshTokenSignal.set(null);
    currentUserSignal.set(null);
    userPermissionsSignal.set([]);
    isAuthenticatedSignal.set(false);
    authErrorSignal.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.authStateSubject.next(false);
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return accessTokenSignal();
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return refreshTokenSignal();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!accessTokenSignal() && !!currentUserSignal();
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = this.parseJwt(token);
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Check if user has permission
   */
  hasPermission(permissionName: string): boolean {
    return userPermissionsSignal().some(p => p.name === permissionName);
  }

  /**
   * Check if user has role
   */
  hasRole(role: string): boolean {
    const user = currentUserSignal();
    return user?.role === role;
  }

  /**
   * Get current user
   */
  getCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}/me`);
  }

  // ==================== PRIVATE METHODS ====================

  private setAuthTokens(response: LoginResponse): void {
    accessTokenSignal.set(response.accessToken);
    refreshTokenSignal.set(response.refreshToken);
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('currentUser');

    if (token && user) {
      accessTokenSignal.set(token);
      currentUserSignal.set(JSON.parse(user));
      isAuthenticatedSignal.set(true);
      this.authStateSubject.next(true);
    }
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }
}

