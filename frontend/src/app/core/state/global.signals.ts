import { computed, effect, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Tenant } from '../models/tenant.model';
import { Notification } from '../models/notification.model';
import { Permission } from '../models/auth.model';

// ==================== AUTHENTICATION STATE ====================

export const currentUserSignal = signal<User | null>(null);
export const isAuthenticatedSignal = signal<boolean>(false);
export const authLoadingSignal = signal<boolean>(false);
export const authErrorSignal = signal<string | null>(null);
export const accessTokenSignal = signal<string | null>(null);
export const refreshTokenSignal = signal<string | null>(null);

// ==================== TENANT STATE ====================

export const currentTenantSignal = signal<Tenant | null>(null);
export const tenantIdSignal = computed(() => 
  currentTenantSignal()?.id ?? localStorage.getItem('tenantId')
);

// ==================== UI STATE ====================

export const sidebarOpenSignal = signal<boolean>(true);
export const darkModeSignal = signal<boolean>(
  localStorage.getItem('darkMode') === 'true' || false
);
export const loadingSignal = signal<boolean>(false);
export const notificationsSignal = signal<Notification[]>([]);
export const pageLoadingSignal = signal<boolean>(false);

// ==================== PERMISSION STATE ====================

export const userPermissionsSignal = signal<Permission[]>([]);
export const canAccessAdminSignal = computed(() =>
  userPermissionsSignal().some(p => p.name === 'ADMIN_ACCESS')
);

// ==================== COMPUTED SIGNALS ====================

export const userDisplayNameSignal = computed(() => {
  const user = currentUserSignal();
  return user ? `${user.firstName} ${user.lastName}` : 'Guest';
});

export const unreadNotificationCountSignal = computed(() =>
  notificationsSignal().filter(n => !n.read).length
);

export const isLoadingSignal = computed(() => 
  authLoadingSignal() || loadingSignal() || pageLoadingSignal()
);

// ==================== EFFECTS ====================

// Auto-sync user to localStorage
effect(() => {
  const user = currentUserSignal();
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
});

// Auto-sync tokens to localStorage
effect(() => {
  const token = accessTokenSignal();
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
});

// Auto-sync refresh token to localStorage
effect(() => {
  const token = refreshTokenSignal();
  if (token) {
    localStorage.setItem('refreshToken', token);
  } else {
    localStorage.removeItem('refreshToken');
  }
});

// Apply dark mode
effect(() => {
  const isDark = darkModeSignal();
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('darkMode', isDark.toString());
});

// Auto-sync tenant to localStorage
effect(() => {
  const tenant = currentTenantSignal();
  if (tenant) {
    localStorage.setItem('tenantId', tenant.id);
  }
});

// Remove old notifications after 5 seconds
effect(() => {
  const notifications = notificationsSignal();
  if (notifications.length > 0) {
    const timer = setTimeout(() => {
      const autoRemoveNotifications = notifications.filter(n => n.type !== 'error');
      if (autoRemoveNotifications.length < notifications.length) {
        notificationsSignal.set(autoRemoveNotifications);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }
  return;
});
