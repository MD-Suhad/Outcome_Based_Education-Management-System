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
      <h2>Welcome Back</h2>
      <p>Log in to your OBE management account</p>
    </div>

    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
      <div *ngIf="errorMessage()" class="error-banner">
        {{ errorMessage() }}
      </div>

      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          formControlName="username"
          placeholder="Enter your username"
          [class.invalid]="isFieldInvalid('username')"
        />
        <span class="error-text" *ngIf="isFieldInvalid('username')">Username is required</span>
      </div>

      <div class="form-group">
        <div class="label-wrapper">
          <label for="password">Password</label>
        </div>
        <input
          id="password"
          type="password"
          formControlName="password"
          placeholder="••••••••"
          [class.invalid]="isFieldInvalid('password')"
        />
        <span class="error-text" *ngIf="isFieldInvalid('password')">Password is required</span>
      </div>

      <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="btn-primary">
        <span *ngIf="!isLoading()">Sign In</span>
        <span *ngIf="isLoading()" class="spinner"></span>
      </button>

      <div class="form-footer">
        <p>Don't have an account? <a routerLink="/auth/register">Sign Up</a></p>
      </div>
    </form>
  `,
  styles: [`
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .login-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
      font-family: 'Outfit', sans-serif;
    }
    .login-header p {
      color: #94a3b8;
      margin: 0;
      font-size: 0.875rem;
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
      font-size: 0.875rem;
      font-weight: 500;
      color: #cbd5e1;
    }
    .label-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    input {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: #f8fafc;
      font-size: 0.95rem;
      transition: all 0.2s ease-in-out;
      width: 100%;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
    input.invalid {
      border-color: #ef4444;
    }
    .error-text {
      color: #ef4444;
      font-size: 0.75rem;
    }
    .error-banner {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid #ef4444;
      color: #fca5a5;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      text-align: center;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 600;
      padding: 0.85rem;
      transition: all 0.2s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0.5rem;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .form-footer {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.85rem;
      color: #94a3b8;
    }
    .form-footer a {
      color: #818cf8;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    .form-footer a:hover {
      color: #a5b4fc;
      text-decoration: underline;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  protected loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string | null>(null);

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res && res.Success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(res?.Message || 'Authentication failed. Please check credentials.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error || 'Server error. Please try again later.');
      }
    });
  }
}
