import { Injectable, signal, computed } from '@angular/core';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'cqi' | 'assessment' | 'system' | 'accreditation';
  severity: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = signal<AppNotification[]>([
    {
      id: 'n1',
      title: 'CQI Gap Warning: CSE-301',
      message: 'Course Outcome CO3 (Database Locks) scored 5.8% below target threshold. Action plan review required.',
      type: 'cqi',
      severity: 'warning',
      timestamp: '10 mins ago',
      isRead: false,
      actionUrl: '/dashboard/results/attainment'
    },
    {
      id: 'n2',
      title: 'New Assessment Published',
      message: 'Midterm Practical Exam rubric for CSE-301 has been approved by HOD.',
      type: 'assessment',
      severity: 'info',
      timestamp: '1 hour ago',
      isRead: false,
      actionUrl: '/dashboard/assessments'
    },
    {
      id: 'n3',
      title: 'Accreditation Evidence Audit Ready',
      message: 'Washington Accord Annual PLO Attainment Summary report is generated for B.Sc. CSE.',
      type: 'accreditation',
      severity: 'success',
      timestamp: '3 hours ago',
      isRead: false,
      actionUrl: '/dashboard/results/attainment'
    },
    {
      id: 'n4',
      title: 'System Maintenance Scheduled',
      message: 'Database connection pool optimization & index re-indexing scheduled for Saturday 02:00 UTC.',
      type: 'system',
      severity: 'critical',
      timestamp: 'Yesterday',
      isRead: true
    }
  ]);

  private toasts = signal<AppNotification[]>([]);

  public notifications$ = this.notifications.asReadonly();
  public toasts$ = this.toasts.asReadonly();
  public unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  public markAsRead(id: string): void {
    this.notifications.update(list =>
      list.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  public markAllAsRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
  }

  public removeNotification(id: string): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  public removeToast(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  public showSuccess(title: string, message: string): void {
    this.triggerToast(title, message, 'success');
  }

  public showError(title: string, message: string): void {
    this.triggerToast(title, message, 'critical');
  }

  public showWarning(title: string, message: string): void {
    this.triggerToast(title, message, 'warning');
  }

  public showInfo(title: string, message: string): void {
    this.triggerToast(title, message, 'info');
  }

  private triggerToast(title: string, message: string, severity: AppNotification['severity']): void {
    const id = 't_' + Date.now();
    const newToast: AppNotification = {
      id,
      title,
      message,
      type: 'system',
      severity,
      timestamp: 'Just now',
      isRead: true
    };
    this.toasts.update(list => [newToast, ...list]);

    // Auto-dismiss toast after 4 seconds
    setTimeout(() => {
      this.removeToast(id);
    }, 4000);
  }

  public addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): void {
    const newNotif: AppNotification = {
      ...notification,
      id: 'n_' + Date.now(),
      timestamp: 'Just now',
      isRead: false
    };
    this.notifications.update(list => [newNotif, ...list]);
    this.triggerToast(notification.title, notification.message, notification.severity);
  }
}
