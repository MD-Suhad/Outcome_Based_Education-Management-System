import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';
import { currentUserSignal } from '../../core/state/global.signals';
import { NotificationService } from '../../core/notification/notification.service';
import { ToastContainerComponent } from '../../core/notification/toast-container.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, ToastContainerComponent],
  template: `
    <div class="dashboard-wrapper">
      <app-toast-container></app-toast-container>
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="isSidebarCollapsed()">
        <div class="logo-area">
          <span class="logo-icon">🎓</span>
          <span class="logo-text" *ngIf="!isSidebarCollapsed()">OBE Portal</span>
        </div>

        <nav class="nav-menu">
          <!-- Main Section -->
          <div class="nav-section-label" *ngIf="!isSidebarCollapsed()">MAIN</div>
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <span class="material-icons">space_dashboard</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">Overview</span>
          </a>

          <!-- OBE Curriculum Section -->
          <div class="nav-section-label" *ngIf="!isSidebarCollapsed()">OBE CURRICULUM</div>
          <a routerLink="/dashboard/courses" routerLinkActive="active" class="nav-item">
            <span class="material-icons">menu_book</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">OBE Courses</span>
          </a>
          <a routerLink="/dashboard/programs/outcomes" routerLinkActive="active" class="nav-item">
            <span class="material-icons">track_changes</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">Program PLOs</span>
          </a>
          <a routerLink="/dashboard/outcomes/matrix" routerLinkActive="active" class="nav-item">
            <span class="material-icons">grid_on</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">CO-PO Matrix</span>
          </a>
          <a routerLink="/dashboard/ai-assistant" routerLinkActive="active" class="nav-item ai-item">
            <span class="material-icons">auto_awesome</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">AI Alignment Assistant</span>
          </a>

          <!-- Evaluation & Attainment Section -->
          <div class="nav-section-label" *ngIf="!isSidebarCollapsed()">EVALUATION</div>
          <a routerLink="/dashboard/assessments" routerLinkActive="active" class="nav-item">
            <span class="material-icons">assignment</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">Assessments & Rubrics</span>
          </a>
          <a routerLink="/dashboard/results/attainment" routerLinkActive="active" class="nav-item">
            <span class="material-icons">analytics</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">Attainment & CQI</span>
          </a>

          <!-- Administration Section -->
          <div class="nav-section-label" *ngIf="!isSidebarCollapsed()">ADMINISTRATION</div>
          <a routerLink="/dashboard/notifications" routerLinkActive="active" class="nav-item">
            <span class="material-icons">notifications_active</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">Notifications Center</span>
          </a>
          <a routerLink="/dashboard/departments" routerLinkActive="active" class="nav-item">
            <span class="material-icons">account_balance</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">Faculties & Depts</span>
          </a>
          <a routerLink="/dashboard/users" routerLinkActive="active" class="nav-item">
            <span class="material-icons">group</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">User Management</span>
          </a>
          <a routerLink="/dashboard/students/bulk-upload" routerLinkActive="active" class="nav-item">
            <span class="material-icons">cloud_upload</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">Student Bulk Upload</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button (click)="toggleSidebar()" class="btn-toggle">
            <span class="material-icons">{{ isSidebarCollapsed() ? 'chevron_right' : 'chevron_left' }}</span>
          </button>
        </div>
      </aside>

      <!-- Main Layout -->
      <div class="main-layout">
        <!-- Top Navigation -->
        <header class="top-nav">
          <div class="header-left">
            <h1 class="page-title">Outcome-Based Education Management</h1>
          </div>

          <div class="header-right">
            <!-- Real-Time Notification Bell Dropdown -->
            <div class="notification-wrapper">
              <button (click)="toggleNotifications()" class="nav-icon-btn" title="Notifications">
                <span class="material-icons">notifications</span>
                <span class="notif-badge" *ngIf="notifService.unreadCount() > 0">
                  {{ notifService.unreadCount() }}
                </span>
              </button>

              <!-- Dropdown Panel -->
              <div class="notif-dropdown" *ngIf="isNotifOpen()">
                <div class="notif-header">
                  <h3>System Notifications</h3>
                  <button (click)="notifService.markAllAsRead()" class="btn-text">Mark all read</button>
                </div>

                <div class="notif-list">
                  <div 
                    *ngFor="let item of notifService.notifications$()" 
                    class="notif-item"
                    [class.unread]="!item.isRead"
                    (click)="onNotifClick(item)"
                  >
                    <div class="notif-dot" [class]="item.severity"></div>
                    <div class="notif-content">
                      <span class="notif-title">{{ item.title }}</span>
                      <span class="notif-msg">{{ item.message }}</span>
                      <span class="notif-time">{{ item.timestamp }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Theme Toggle -->
            <button (click)="themeService.toggleDarkMode()" class="theme-toggle">
              <span class="material-icons">
                {{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}
              </span>
            </button>

            <!-- User Badge -->
            <div class="user-badge" *ngIf="currentUserSignal() as user">
              <span class="user-avatar">
                {{ user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U' }}
              </span>
              <div class="user-details">
                <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
                <span class="user-role">{{ user.email }}</span>
              </div>
              <button (click)="onLogout()" class="logout-btn">
                <span class="material-icons">logout</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Page View Container -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      display: flex;
      min-height: 100vh;
      background: var(--bg-app);
      color: var(--text-body);
      font-family: var(--font-main);
    }

    /* Sidebar styles */
    .sidebar {
      width: 260px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--sidebar-border);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .sidebar.collapsed {
      width: 80px;
    }
    .logo-area {
      height: 70px;
      display: flex;
      align-items: center;
      padding: 0 1.5rem;
      gap: 1rem;
      border-bottom: 1px solid var(--sidebar-border);
    }
    .logo-icon {
      font-size: 1.8rem;
    }
    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--logo-text-main);
      white-space: nowrap;
    }
    .nav-menu {
      padding: 1.25rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      flex: 1;
      overflow-y: auto;
    }
    .nav-section-label {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 1px;
      color: #64748b;
      margin: 0.8rem 0 0.25rem 0.8rem;
      text-transform: uppercase;
    }
    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      gap: 1rem;
      color: var(--nav-item-text);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .nav-item:hover {
      background: var(--nav-item-hover-bg);
      color: var(--nav-item-hover-text);
    }
    .nav-item.active {
      background: var(--nav-item-active-bg);
      color: var(--nav-item-active-text);
      font-weight: 600;
      border-left: 3px solid var(--nav-item-active-border);
    }
    .sidebar-footer {
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid var(--sidebar-border);
    }
    .btn-toggle {
      background: none;
      border: none;
      color: var(--nav-item-text);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .btn-toggle:hover {
      background: var(--nav-item-hover-bg);
    }

    /* Main layout styles */
    .main-layout {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .top-nav {
      height: 70px;
      background: var(--bg-top-nav);
      border-bottom: 1px solid var(--border-nav);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      z-index: 10;
    }
    .page-title {
      font-size: 1.15rem;
      font-weight: 600;
      margin: 0;
      color: var(--logo-text-main);
      font-family: 'Outfit', sans-serif;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    /* Notification Center Styles */
    .notification-wrapper {
      position: relative;
    }
    .nav-icon-btn {
      background: none;
      border: none;
      color: var(--nav-item-text);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: background 0.2s;
    }
    .nav-icon-btn:hover { background: var(--nav-item-hover-bg); }
    .notif-badge {
      position: absolute;
      top: 2px;
      right: 2px;
      background: #f43f5e;
      color: white;
      font-size: 0.68rem;
      font-weight: 800;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 8px rgba(244, 63, 94, 0.6);
    }

    .notif-dropdown {
      position: absolute;
      right: 0;
      top: 50px;
      width: 360px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      z-index: 100;
      overflow: hidden;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .notif-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .notif-header h3 { font-size: 0.95rem; font-weight: 700; color: #f8fafc; margin: 0; }
    .btn-text { background: none; border: none; color: #818cf8; font-size: 0.78rem; font-weight: 600; cursor: pointer; }
    .btn-text:hover { text-decoration: underline; }

    .notif-list { max-height: 340px; overflow-y: auto; display: flex; flex-direction: column; }
    .notif-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      cursor: pointer;
      transition: background 0.2s;
    }
    .notif-item:hover { background: rgba(255, 255, 255, 0.04); }
    .notif-item.unread { background: rgba(99, 102, 241, 0.08); }
    .notif-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 0.35rem; flex-shrink: 0; }
    .notif-dot.warning { background: #fbbf24; box-shadow: 0 0 6px #fbbf24; }
    .notif-dot.critical { background: #f43f5e; box-shadow: 0 0 6px #f43f5e; }
    .notif-dot.success { background: #34d399; box-shadow: 0 0 6px #34d399; }
    .notif-dot.info { background: #60a5fa; box-shadow: 0 0 6px #60a5fa; }

    .notif-content { display: flex; flex-direction: column; gap: 0.2rem; }
    .notif-title { font-size: 0.85rem; font-weight: 700; color: #f8fafc; }
    .notif-msg { font-size: 0.78rem; color: #94a3b8; line-height: 1.3; }
    .notif-time { font-size: 0.7rem; color: #64748b; margin-top: 0.2rem; }

    .ai-item {
      background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
      border: 1px solid rgba(236, 72, 153, 0.3);
      color: #f472b6 !important;
    }

    .page-content {
      padding: 2rem;
      flex: 1;
      overflow-y: auto;
    }
  `]
})
export class DashboardComponent {
  protected authService = inject(AuthService);
  protected themeService = inject(ThemeService);
  protected notifService = inject(NotificationService);
  private router = inject(Router);

  protected currentUserSignal = currentUserSignal;
  protected isSidebarCollapsed = signal<boolean>(false);
  protected isNotifOpen = signal<boolean>(false);

  protected toggleSidebar(): void {
    this.isSidebarCollapsed.update((v) => !v);
  }

  protected toggleNotifications(): void {
    this.isNotifOpen.update((v) => !v);
  }

  protected onNotifClick(item: any): void {
    this.notifService.markAsRead(item.id);
    if (item.actionUrl) {
      this.router.navigate([item.actionUrl]);
      this.isNotifOpen.set(false);
    }
  }

  protected onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
