import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-header">
      <h2 class="welcome-title">Welcome Back</h2>
      <p class="welcome-subtitle">Sign in with your username or institutional email</p>
    </div>

    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
      <div *ngIf="errorMessage()" class="error-banner">
        <span class="error-icon">⚠️</span>
        <span>{{ errorMessage() }}</span>
      </div>

      <!-- Username or Email Field -->
      <div class="form-group">
        <label for="email">Username or Email</label>
        <div class="input-wrapper">
          <span class="input-icon">👤</span>
          <input
            id="email"
            type="text"
            formControlName="email"
            placeholder="e.g. shohaibsuhad1211 or user@univ.edu"
            [class.invalid]="isFieldInvalid('email')"
            autocomplete="username"
          />
        </div>
        <span class="error-text" *ngIf="isFieldInvalid('email')">
          Username or email is required (min 3 characters)
        </span>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <div class="label-row">
          <label for="password">Password</label>
          <a href="javascript:void(0)" class="forgot-link">Forgot password?</a>
        </div>
        <div class="input-wrapper">
          <span class="input-icon">🔒</span>
          <input
            id="password"
            [type]="showPassword() ? 'text' : 'password'"
            formControlName="password"
            placeholder="••••••••"
            [class.invalid]="isFieldInvalid('password')"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="toggle-eye-btn"
            (click)="togglePasswordVisibility()"
            title="Toggle Password Visibility"
          >
            {{ showPassword() ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>
        <span class="error-text" *ngIf="isFieldInvalid('password')">Password is required</span>
      </div>

      <!-- Remember Me Row -->
      <div class="options-row">
        <label class="checkbox-container">
          <input type="checkbox" formControlName="rememberMe" />
          <span class="checkmark"></span>
          <span class="checkbox-label">Remember me on this device</span>
        </label>
      </div>

      <!-- Quick Fill Demo Chips -->
      <div class="quick-fill-section">
        <span class="quick-title">Quick Demo Login:</span>
        <div class="chips-group">
          <button type="button" class="demo-chip" (click)="quickFill('shohaibsuhad1211')">shohaibsuhad1211</button>
          <button type="button" class="demo-chip" (click)="quickFill('admin@obe.edu')">admin&#64;obe.edu</button>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="btn-primary">
        <span *ngIf="!isLoading()" class="btn-content">
          <span>Sign In to Portal</span>
          <span class="arrow-icon">→</span>
        </span>
        <span *ngIf="isLoading()" class="spinner-box">
          <span class="spinner"></span>
          <span>Authenticating...</span>
        </span>
      </button>

      <div class="form-footer">
        <p>Don't have an account? <a routerLink="/auth/register" class="signup-link">Create Account</a></p>
      </div>
    </form>
  `,
  styles: [`
    .login-header {
      margin-bottom: 2rem;
    }
    .welcome-title {
      font-family: 'Outfit', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 0.4rem 0;
      letter-spacing: -0.5px;
    }
    .welcome-subtitle {
      color: #94a3b8;
      font-size: 0.9rem;
      margin: 0;
      line-height: 1.4;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #cbd5e1;
      letter-spacing: 0.2px;
    }
    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .forgot-link {
      color: #818cf8;
      font-size: 0.8rem;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s;
    }
    .forgot-link:hover {
      color: #a5b4fc;
      text-decoration: underline;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 1rem;
      font-size: 1rem;
      pointer-events: none;
      opacity: 0.7;
    }
    .toggle-eye-btn {
      position: absolute;
      right: 0.75rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .toggle-eye-btn:hover {
      opacity: 1;
    }

    input[type="text"],
    input[type="email"],
    input[type="password"] {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 0.85rem 1rem 0.85rem 2.8rem;
      color: #f8fafc;
      font-size: 0.95rem;
      font-family: inherit;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: #6366f1;
      background: rgba(30, 41, 59, 0.8);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25),
                  0 0 20px rgba(99, 102, 241, 0.15);
    }
    input.invalid {
      border-color: #f43f5e;
      box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.2);
    }

    .error-text {
      color: #f43f5e;
      font-size: 0.78rem;
      font-weight: 500;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #fecdd3;
      padding: 0.85rem 1rem;
      border-radius: 12px;
      font-size: 0.85rem;
      line-height: 1.4;
      animation: slideDown 0.3s ease-out;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .options-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: -0.25rem;
    }
    .checkbox-container {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      user-select: none;
    }
    .checkbox-container input {
      display: none;
    }
    .checkmark {
      width: 18px;
      height: 18px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 5px;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .checkbox-container input:checked ~ .checkmark {
      background: #6366f1;
      border-color: #6366f1;
    }
    .checkbox-container input:checked ~ .checkmark::after {
      content: '✓';
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
    }
    .checkbox-label {
      color: #94a3b8;
      font-size: 0.82rem;
    }

    /* Quick Fill Chips */
    .quick-fill-section {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 0.5rem 0.75rem;
    }
    .quick-title {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
      white-space: nowrap;
    }
    .chips-group {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    .demo-chip {
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #a5b4fc;
      border-radius: 6px;
      padding: 0.2rem 0.5rem;
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .demo-chip:hover {
      background: rgba(99, 102, 241, 0.3);
      color: #ffffff;
      transform: translateY(-1px);
    }

    /* Primary Button */
    .btn-primary {
      position: relative;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border: none;
      border-radius: 12px;
      color: white;
      cursor: pointer;
      font-size: 0.98rem;
      font-weight: 700;
      padding: 0.95rem;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
      margin-top: 0.5rem;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.6);
      background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
    }
    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }
    .btn-primary:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      box-shadow: none;
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .arrow-icon {
      font-size: 1.1rem;
      transition: transform 0.2s;
    }
    .btn-primary:hover .arrow-icon {
      transform: translateX(4px);
    }

    .spinner-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .form-footer {
      text-align: center;
      margin-top: 0.5rem;
      font-size: 0.88rem;
      color: #94a3b8;
    }
    .signup-link {
      color: #818cf8;
      text-decoration: none;
      font-weight: 700;
      margin-left: 0.3rem;
      transition: color 0.2s;
    }
    .signup-link:hover {
      color: #a5b4fc;
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Accept either username or email (min 3 chars required)
  protected loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required]],
    rememberMe: [true]
  });

  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string | null>(null);
  protected showPassword = signal<boolean>(false);

  protected togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  protected quickFill(username: string): void {
    this.loginForm.patchValue({
      email: username,
      password: 'password123'
    });
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Authentication failed. Please verify your username/email and password.'
        );
      }
    });
  }
}

