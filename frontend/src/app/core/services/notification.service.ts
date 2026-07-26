import { Injectable } from '@angular/core';
import { 
  notificationsSignal, 
  loadingSignal,
  pageLoadingSignal 
} from '../state/global.signals';
import { Notification, NotificationType } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  
  /**
   * Show success notification
   */
  success(message: string, title: string = 'Success', duration: number = 5000): void {
    this.show({
      title,
      message,
      type: NotificationType.SUCCESS,
      duration
    });
  }

  /**
   * Show error notification
   */
  error(message: string, title: string = 'Error', duration: number = 10000): void {
    this.show({
      title,
      message,
      type: NotificationType.ERROR,
      duration
    });
  }

  /**
   * Show warning notification
   */
  warning(message: string, title: string = 'Warning', duration: number = 5000): void {
    this.show({
      title,
      message,
      type: NotificationType.WARNING,
      duration
    });
  }

  /**
   * Show info notification
   */
  info(message: string, title: string = 'Info', duration: number = 5000): void {
    this.show({
      title,
      message,
      type: NotificationType.INFO,
      duration
    });
  }

  /**
   * Show custom notification
   */
  show(config: {
    title: string;
    message: string;
    type: NotificationType;
    duration?: number;
    action?: { label: string; link: string };
  }): void {
    const notification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      title: config.title,
      message: config.message,
      type: config.type,
      read: false,
      data: {},
      createdAt: new Date().toISOString(),
      action: config.action
    };

    const currentNotifications = notificationsSignal();
    notificationsSignal.set([...currentNotifications, notification]);

    // Auto-remove after duration
    if (config.duration && config.type !== NotificationType.ERROR) {
      setTimeout(() => {
        const updated = notificationsSignal().filter(n => n.id !== notification.id);
        notificationsSignal.set(updated);
      }, config.duration);
    }
  }

  /**
   * Remove notification by id
   */
  remove(id: string): void {
    const updated = notificationsSignal().filter(n => n.id !== id);
    notificationsSignal.set(updated);
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): void {
    const notifications = notificationsSignal().map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    notificationsSignal.set(notifications);
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    notificationsSignal.set([]);
  }

  /**
   * Get all notifications
   */
  getAll(): Notification[] {
    return notificationsSignal();
  }
}
