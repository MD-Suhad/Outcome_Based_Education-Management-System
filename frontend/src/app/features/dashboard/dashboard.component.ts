import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';
import { currentUserSignal } from '../../core/state/global.signals';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="dashboard-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="isSidebarCollapsed()">
        <div class="logo-area">
          <span class="logo-icon">🎓</span>
          <span class="logo-text" *ngIf="!isSidebarCollapsed()">OBE Portal</span>
        </div>

        <nav class="nav-menu">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <span class="material-icons">dashboard</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">Overview</span>
          </a>
          <a routerLink="/dashboard/courses" routerLinkActive="active" class="nav-item">
            <span class="material-icons">menu_book</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">OBE Courses</span>
          </a>
          <a routerLink="/dashboard/users" routerLinkActive="active" class="nav-item">
            <span class="material-icons">people</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">User List</span>
          </a>
          <a routerLink="/dashboard/departments" routerLinkActive="active" class="nav-item">
            <span class="material-icons">account_balance</span>
            <span class="item-text" *ngIf="!isSidebarCollapsed()">Faculties & Depts</span>
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
      padding: 1.5rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
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
    .theme-toggle {
      background: none;
      border: none;
      color: var(--nav-item-text);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .theme-toggle:hover {
      background: var(--nav-item-hover-bg);
    }
    .user-badge {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--user-badge-bg);
      border: 1px solid var(--user-badge-border);
      padding: 0.35rem 0.75rem;
      border-radius: 30px;
    }
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .user-details {
      display: flex;
      flex-direction: column;
      font-size: 0.75rem;
      color: var(--user-badge-text);
    }
    .user-name {
      font-weight: 600;
      color: var(--logo-text-main);
    }
    .logout-btn {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0.25rem;
      border-radius: 4px;
    }
    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1);
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
  private router = inject(Router);

  protected currentUserSignal = currentUserSignal;
  protected isSidebarCollapsed = signal<boolean>(false);

  protected toggleSidebar(): void {
    this.isSidebarCollapsed.update((v) => !v);
  }

  protected onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
