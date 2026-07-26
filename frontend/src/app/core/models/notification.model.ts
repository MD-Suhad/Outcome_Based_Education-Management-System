export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
  action?: NotificationAction;
}

export interface NotificationAction {
  label: string;
  link: string;
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}
