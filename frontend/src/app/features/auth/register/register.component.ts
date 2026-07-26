import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-header">
      <h2>Create Account</h2>
      <p>Register as a new user in the OBE platform</p>
    </div>

    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
      <div *ngIf="successMessage()" class="success-banner">
        {{ successMessage() }}
      </div>
      <div *ngIf="errorMessage()" class="error-banner">
        {{ errorMessage() }}
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            formControlName="firstName"
            placeholder="John"
            [class.invalid]="isFieldInvalid('firstName')"
          />
          <span class="error-text" *ngIf="isFieldInvalid('firstName')">Required</span>
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            formControlName="lastName"
            placeholder="Doe"
            [class.invalid]="isFieldInvalid('lastName')"
          />
          <span class="error-text" *ngIf="isFieldInvalid('lastName')">Required</span>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email Address</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          placeholder="john.doe@example.com"
          [class.invalid]="isFieldInvalid('email')"
        />
        <span class="error-text" *ngIf="isFieldInvalid('email')">Please enter a valid email</span>
      </div>

      <div class="form-group">
        <label for="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          type="text"
          formControlName="phoneNumber"
          placeholder="+1234567890"
          [class.invalid]="isFieldInvalid('phoneNumber')"
        />
      </div>

      <div class="form-group">
        <label for="address">Address</label>
        <input
          id="address"
          type="text"
          formControlName="address"
          placeholder="Street, City, Country"
          [class.invalid]="isFieldInvalid('address')"
        />
      </div>

      <button type="submit" [disabled]="registerForm.invalid || isLoading()" class="btn-primary">
        <span *ngIf="!isLoading()">Register</span>
        <span *ngIf="isLoading()" class="spinner"></span>
      </button>

      <div class="form-footer">
        <p>Already have an account? <a routerLink="/auth/login">Sign In</a></p>
      </div>
    </form>
  `,
  styles: [`
    .register-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .register-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
      font-family: 'Outfit', sans-serif;
    }
    .register-header p {
      color: #94a3b8;
      margin: 0;
      font-size: 0.875rem;
    }
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .form-row .form-group {
      flex: 1;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-group label {
      font-size: 0.825rem;
      font-weight: 500;
      color: #cbd5e1;
    }
    input {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.65rem 0.85rem;
      color: #f8fafc;
      font-size: 0.9rem;
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
      font-size: 0.7rem;
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
    .success-banner {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      color: #a7f3d0;
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
      padding: 0.8rem;
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
      margin-top: 0.5rem;
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
      width: 18px;
      height: 18px;
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  protected registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    address: ['']
  });

  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string | null>(null);
  protected successMessage = signal<string | null>(null);

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  protected onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.signup(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Account registered successfully! Redirecting...');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Registration failed. Try again.');
      }
    });
  }
}
