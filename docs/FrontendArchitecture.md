# Outcome-Based Education Management System (OBE-MS)
## Enterprise Frontend Architecture Blueprint (Angular 19+)

The Angular client application is engineered as an enterprise-grade Single Page Application (SPA) utilizing **Angular Signals** for reactive state management, **Standalone Components**, dynamic glassmorphism UI themes, and role-based lazy-loaded feature modules.

---

## 1. Directory Structure

```
frontend/src/app/
├── app.config.ts             # Global providers (Router, HttpClient, Animations, Interceptors)
├── app.routes.ts             # Application navigation routes & lazy loading definitions
├── app.ts                    # Root application component wrapper
├── core/                     # Singleton services, Guards, HTTP Interceptors, Auth Context
│   ├── auth/                 # AuthService, AuthGuard, RoleGuard, Token Storage
│   ├── interceptors/         # AuthInterceptor, ErrorInterceptor, TenantInterceptor
│   ├── notification/         # NotificationService, ToastContainerComponent, ToastComponent
│   └── theme/                # ThemeService (Dark/Light glassmorphism switcher)
├── layouts/                  # Structural wrapper layouts
│   ├── auth-layout/          # Minimal layout for Login / Password Reset
│   └── dashboard-layout/     # Admin / Faculty Sidebar, Top Header, Toast Container
└── features/                 # Domain-driven lazy-loaded feature modules
    ├── ai-assistant/         # LLM Syllabus Analyzer & Rubric Generator
    ├── assessments/          # Assessment Manager & Dynamic Rubric Preview
    ├── auth/                 # Login & Registration views
    ├── courses/              # Course metadata & Syllabus editor
    ├── dashboard/            # Role-specific analytics dashboard
    ├── notifications/        # Notification Management Center page
    ├── outcomes/             # Interactive CO-PO Correlation Matrix UI
    ├── programs/             # Program Outcome (PO) definition & taxonomy manager
    └── results/              # Direct Outcome Attainment & Gap Analytics engine
```

---

## 2. State & Reactivity with Angular Signals

The application replaces legacy RxJS subject state patterns with **Angular Signals** for optimal change detection performance.

```typescript
// Core Auth State Signal Example
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Writable signal for reactive current user state
  readonly currentUser = signal<UserContext | null>(null);
  
  // Computed signal for authenticated status
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  
  // Computed signal for user permissions
  readonly userRole = computed(() => this.currentUser()?.role ?? 'GUEST');
}
```

---

## 3. UI Design System & Theme Engine

- **Glassmorphism & SCSS Variables:** Custom dark and light themes with backdrop blur (`backdrop-filter: blur(12px)`), radiant gradients, and CSS custom properties.
- **Theme Switcher Service:** `ThemeService` toggles between `'dark-mode'` and `'light-mode'` root CSS classes dynamically, persisting user preference in `localStorage`.
- **Responsive Layout:** Dynamic sidebars with mobile collapse drawers and smooth transition animations.

---

## 4. Key Feature Modules Mapping

| Feature Module | Route Path | Core Components |
| :--- | :--- | :--- |
| **Dashboard** | `/dashboard` | `DashboardComponent` |
| **Program Outcomes** | `/dashboard/programs` | `ProgramOutcomesComponent` |
| **CO-PO Matrix** | `/dashboard/outcomes` | `CopoMappingComponent` |
| **Assessments** | `/dashboard/assessments` | `AssessmentManagerComponent` |
| **Attainment Analytics**| `/dashboard/results` | `AttainmentAnalyticsComponent` |
| **AI Assistant** | `/dashboard/ai-assistant` | `AiAssistantComponent` |
| **Notification Center**| `/dashboard/notifications`| `NotificationCenterComponent` |

---

## 5. Notification & Toast Engine

The frontend includes a global toast notification service (`NotificationService`) mounted directly in `DashboardLayoutComponent` via `ToastContainerComponent`:

```typescript
// Triggering Toasts anywhere in the app:
this.notificationService.success('CO-PO Matrix saved successfully!');
this.notificationService.warning('Target attainment threshold not reached for CO-2');
```
