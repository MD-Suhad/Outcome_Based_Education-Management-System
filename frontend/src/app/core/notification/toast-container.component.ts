import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from './notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of activeToasts()" 
        class="toast-card"
        [class]="toast.severity"
      >
        <div class="toast-icon">
          <span *ngIf="toast.severity === 'success'">✅</span>
          <span *ngIf="toast.severity === 'warning'">⚠️</span>
          <span *ngIf="toast.severity === 'critical'">🚨</span>
          <span *ngIf="toast.severity === 'info'">ℹ️</span>
        </div>

        <div class="toast-body">
          <span class="toast-title">{{ toast.title }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
        </div>

        <button (click)="closeToast(toast.id)" class="toast-close">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
      animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(50px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .toast-card.success { border-left: 4px solid #10b981; }
    .toast-card.warning { border-left: 4px solid #f59e0b; }
    .toast-card.critical { border-left: 4px solid #f43f5e; }
    .toast-card.info { border-left: 4px solid #3b82f6; }

    .toast-icon { font-size: 1.2rem; }
    .toast-body { display: flex; flex-direction: column; gap: 0.2rem; flex: 1; }
    .toast-title { font-size: 0.88rem; font-weight: 700; color: #f8fafc; }
    .toast-msg { font-size: 0.78rem; color: #94a3b8; line-height: 1.3; }

    .toast-close {
      background: none;
      border: none;
      color: #64748b;
      font-weight: bold;
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.2rem;
    }
    .toast-close:hover { color: white; }
  `]
})
export class ToastContainerComponent {
  protected notifService = inject(NotificationService);

  protected activeToasts = this.notifService.toasts$;

  protected closeToast(id: string): void {
    this.notifService.removeToast(id);
  }
}
