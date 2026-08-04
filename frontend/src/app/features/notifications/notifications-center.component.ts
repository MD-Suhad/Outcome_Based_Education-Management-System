import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService, AppNotification } from '../../core/notification/notification.service';

@Component({
  selector: 'app-notifications-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="header-title">🔔 System Notifications & Alerts</h1>
          <p class="header-subtitle">Real-time CQI warnings, assessment approvals, and accreditation audit logs</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" (click)="notifService.markAllAsRead()">✓ Mark All as Read</button>
          <button class="btn-primary" (click)="triggerTestNotif()">+ Test Trigger Alert</button>
        </div>
      </div>

      <!-- Notification Metrics Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon purple">🔔</div>
          <div class="stat-info">
            <span class="stat-value">{{ notifService.notifications$().length }}</span>
            <span class="stat-label">Total Notifications</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">🔴</div>
          <div class="stat-info">
            <span class="stat-value">{{ notifService.unreadCount() }}</span>
            <span class="stat-label">Unread Alerts</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">⚠️</div>
          <div class="stat-info">
            <span class="stat-value">{{ countBySeverity('warning') }}</span>
            <span class="stat-label">CQI Gap Warnings</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">✅</div>
          <div class="stat-info">
            <span class="stat-value">{{ countBySeverity('success') }}</span>
            <span class="stat-label">System Approvals</span>
          </div>
        </div>
      </div>

      <!-- Filters & List -->
      <div class="table-card">
        <div class="filter-bar">
          <div class="tab-group">
            <button 
              class="tab-btn" 
              [class.active]="selectedTab() === 'ALL'"
              (click)="selectedTab.set('ALL')"
            >
              All Alerts ({{ notifService.notifications$().length }})
            </button>
            <button 
              class="tab-btn" 
              [class.active]="selectedTab() === 'UNREAD'"
              (click)="selectedTab.set('UNREAD')"
            >
              Unread ({{ notifService.unreadCount() }})
            </button>
            <button 
              class="tab-btn" 
              [class.active]="selectedTab() === 'CQI'"
              (click)="selectedTab.set('CQI')"
            >
              CQI Warnings
            </button>
            <button 
              class="tab-btn" 
              [class.active]="selectedTab() === 'SYSTEM'"
              (click)="selectedTab.set('SYSTEM')"
            >
              System & Maintenance
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="notifications-list">
          <div 
            *ngFor="let item of filteredNotifications()" 
            class="notification-card"
            [class.unread]="!item.isRead"
          >
            <div class="notif-badge-icon" [class]="item.severity">
              <span *ngIf="item.severity === 'critical'">🚨</span>
              <span *ngIf="item.severity === 'warning'">⚠️</span>
              <span *ngIf="item.severity === 'success'">✅</span>
              <span *ngIf="item.severity === 'info'">ℹ️</span>
            </div>

            <div class="notif-body">
              <div class="notif-top">
                <h4 class="notif-title">{{ item.title }}</h4>
                <span class="notif-time">{{ item.timestamp }}</span>
              </div>
              <p class="notif-message">{{ item.message }}</p>
              <div class="notif-actions">
                <button *ngIf="!item.isRead" class="btn-action" (click)="notifService.markAsRead(item.id)">
                  Mark as Read
                </button>
                <button class="btn-action remove" (click)="notifService.removeNotification(item.id)">
                  Dismiss
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="filteredNotifications().length === 0" class="empty-state">
            <span>🎉 No notifications in this category!</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; }
    .header-title { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 800; color: #f8fafc; margin: 0 0 0.25rem 0; }
    .header-subtitle { color: #94a3b8; font-size: 0.9rem; margin: 0; }
    .header-actions { display: flex; gap: 0.75rem; }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white; border: none; padding: 0.7rem 1.25rem; border-radius: 12px; font-weight: 700; cursor: pointer;
      box-shadow: 0 6px 18px rgba(99, 102, 241, 0.3); transition: all 0.2s;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15);
      color: white; padding: 0.7rem 1.25rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-primary:hover, .btn-secondary:hover { transform: translateY(-2px); }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; }
    .stat-card {
      background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.25rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
    .stat-icon.purple { background: rgba(99, 102, 241, 0.15); }
    .stat-icon.red { background: rgba(244, 63, 94, 0.15); }
    .stat-icon.amber { background: rgba(245, 158, 11, 0.15); }
    .stat-icon.green { background: rgba(16, 185, 129, 0.15); }

    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.4rem; font-weight: 800; color: #f8fafc; font-family: 'Outfit', sans-serif; }
    .stat-label { font-size: 0.8rem; color: #94a3b8; font-weight: 500; }

    .table-card {
      background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 1.5rem;
    }
    .filter-bar { margin-bottom: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 0.8rem; }
    .tab-group { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .tab-btn {
      background: none; border: none; color: #94a3b8; font-weight: 600; font-size: 0.88rem;
      padding: 0.5rem 1rem; border-radius: 10px; cursor: pointer; transition: all 0.2s;
    }
    .tab-btn:hover { color: white; background: rgba(255, 255, 255, 0.05); }
    .tab-btn.active { background: #6366f1; color: white; font-weight: 700; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3); }

    .notifications-list { display: flex; flex-direction: column; gap: 0.85rem; }
    .notification-card {
      background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px; padding: 1.25rem; display: flex; gap: 1rem; align-items: flex-start;
      transition: all 0.2s;
    }
    .notification-card.unread {
      background: rgba(99, 102, 241, 0.08); border-color: rgba(99, 102, 241, 0.3);
    }
    .notif-badge-icon {
      width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; flex-shrink: 0;
    }
    .notif-badge-icon.warning { background: rgba(245, 158, 11, 0.2); }
    .notif-badge-icon.critical { background: rgba(244, 63, 94, 0.2); }
    .notif-badge-icon.success { background: rgba(16, 185, 129, 0.2); }
    .notif-badge-icon.info { background: rgba(59, 130, 246, 0.2); }

    .notif-body { flex: 1; display: flex; flex-direction: column; gap: 0.3rem; }
    .notif-top { display: flex; justify-content: space-between; align-items: center; }
    .notif-title { font-size: 0.95rem; font-weight: 700; color: #f8fafc; margin: 0; }
    .notif-time { font-size: 0.75rem; color: #64748b; }
    .notif-message { font-size: 0.85rem; color: #cbd5e1; margin: 0; line-height: 1.4; }

    .notif-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
    .btn-action {
      background: none; border: 1px solid rgba(255, 255, 255, 0.15); color: #818cf8;
      font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.6rem; border-radius: 6px; cursor: pointer;
    }
    .btn-action.remove { color: #f43f5e; border-color: rgba(244, 63, 94, 0.2); }
    .btn-action:hover { background: rgba(255, 255, 255, 0.1); }

    .empty-state { text-align: center; padding: 3rem; color: #94a3b8; font-weight: 600; }
  `]
})
export class NotificationsCenterComponent {
  protected notifService = inject(NotificationService);
  protected selectedTab = signal<'ALL' | 'UNREAD' | 'CQI' | 'SYSTEM'>('ALL');

  protected filteredNotifications(): AppNotification[] {
    const list = this.notifService.notifications$();
    const tab = this.selectedTab();

    if (tab === 'UNREAD') return list.filter(n => !n.isRead);
    if (tab === 'CQI') return list.filter(n => n.type === 'cqi');
    if (tab === 'SYSTEM') return list.filter(n => n.type === 'system');
    return list;
  }

  protected countBySeverity(severity: string): number {
    return this.notifService.notifications$().filter(n => n.severity === severity).length;
  }

  protected triggerTestNotif(): void {
    this.notifService.addNotification({
      title: 'Real-Time Attainment Warning',
      message: 'CSE-401 Distributed Systems CO2 performance updated for 45 students.',
      type: 'assessment',
      severity: 'info'
    });
  }
}
