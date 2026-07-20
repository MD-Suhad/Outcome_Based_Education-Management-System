# Frontend Architecture - Detailed Design & Implementation Guide

## 🎯 Frontend Vision

Build a **modern, responsive, high-performance Single Page Application (SPA)** using Angular 20 with Standalone Components and Signals-based reactive state management. The frontend should provide an intuitive user experience for managing educational outcomes with real-time data updates and offline-capable features.

---

## 🏗️ Complete Frontend Architecture

### **Layer-Based Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  (Components, Templates, Styling)                           │
├─────────────────────────────────────────────────────────────┤
│  • Pages (full-screen views)                                │
│  • Shared Components (reusable UI elements)                 │
│  • Layout Components (navigation structure)                 │
│  • Material/Tailwind styling                                │
└────────────────────────────────────────────────────────────┬┘
                            │
┌────────────────────────────────────────────────────────────┬┘
│              STATE MANAGEMENT LAYER                        │
│  (Signals, Computed, Effects)                              │
├─────────────────────────────────────────────────────────────┤
│  • Global Signals (user, theme, notifications)             │
│  • Feature Signals (courses, outcomes, results)            │
│  • Computed Signals (filtered data, aggregations)          │
│  • Signal Effects (side effects, subscriptions)            │
└────────────────────────────────────────────────────────────┬┘
                            │
┌────────────────────────────────────────────────────────────┬┘
│              SERVICE LAYER                                 │
│  (API Communication, Data Access)                          │
├─────────────────────────────────────────────────────────────┤
│  • HTTP Services (API calls via HttpClient)                │
│  • Local Storage Service (persistent state)                │
│  • Cache Service (in-memory caching)                       │
│  • WebSocket Service (real-time updates)                   │
└────────────────────────────────────────────────────────────┬┘
                            │
┌────────────────────────────────────────────────────────────┬┘
│         INTERCEPTOR & MIDDLEWARE LAYER                     │
│  (Cross-cutting concerns)                                  │
├─────────────────────────────────────────────────────────────┤
│  • Auth Interceptor (JWT token injection)                  │
│  • Error Interceptor (error handling & retry)              │
│  • Loading Interceptor (progress bar)                      │
│  • Tenant Interceptor (multi-tenancy)                      │
│  • Cache Interceptor (HTTP cache)                          │
│  • Logging Interceptor (request logging)                   │
└────────────────────────────────────────────────────────────┬┘
                            │
┌────────────────────────────────────────────────────────────┬┘
│         HTTP CLIENT & API GATEWAY LAYER                    │
│  (Backend Communication)                                   │
├─────────────────────────────────────────────────────────────┤
│  • HttpClient (Angular's HTTP client)                      │
│  • RxJS Observables (reactive streams)                     │
│  • Error handling & retries                                │
│  • Request/response transformation                         │
└────────────────────────────────────────────────────────────┬┘
                            │
        HTTP / REST / JSON
                            │
        API Gateway (Port 8080)
                            │
        Backend Microservices
```

---

## 📁 Complete Folder Structure

```
frontend/
│
├── src/
│   ├── main.ts                          # Application entry point
│   ├── index.html                       # HTML host document
│   ├── styles.scss                      # Global styles
│   │
│   └── app/
│       ├── app.ts                       # Root component
│       ├── app.config.ts                # Providers & configuration
│       ├── app.routes.ts                # Route definitions
│       ├── app.scss                     # Root styles
│       │
│       ├── core/                        # Singleton services & guards
│       │   ├── auth/
│       │   │   ├── auth.service.ts                # Authentication logic
│       │   │   ├── auth.guard.ts                  # Route guard
│       │   │   ├── token.interceptor.ts           # JWT injection
│       │   │   ├── auth-error.interceptor.ts      # Auth error handling
│       │   │   └── models/
│       │   │       ├── user.model.ts
│       │   │       ├── auth-response.model.ts
│       │   │       └── jwt-payload.model.ts
│       │   │
│       │   ├── interceptors/
│       │   │   ├── error.interceptor.ts           # Global error handling
│       │   │   ├── loading.interceptor.ts         # Show/hide loading
│       │   │   ├── tenant.interceptor.ts          # Add tenant ID header
│       │   │   ├── cache.interceptor.ts           # HTTP caching
│       │   │   └── logging.interceptor.ts         # Request logging
│       │   │
│       │   ├── services/
│       │   │   ├── api.service.ts                 # Base HTTP service
│       │   │   ├── storage.service.ts             # LocalStorage wrapper
│       │   │   ├── notification.service.ts        # Toast notifications
│       │   │   ├── error-handler.service.ts       # Error utilities
│       │   │   ├── loading.service.ts             # Global loading state
│       │   │   ├── theme.service.ts               # Theme switching
│       │   │   └── user-context.service.ts        # Current user context
│       │   │
│       │   └── models/                            # Core shared models
│       │       ├── user.model.ts
│       │       ├── auth.model.ts
│       │       ├── error.model.ts
│       │       └── response.model.ts
│       │
│       ├── shared/                      # Reusable components, pipes, directives
│       │   ├── components/
│       │   │   ├── navbar/
│       │   │   │   ├── navbar.component.ts
│       │   │   │   ├── navbar.component.html
│       │   │   │   └── navbar.component.scss
│       │   │   ├── sidebar/
│       │   │   │   ├── sidebar.component.ts
│       │   │   │   ├── sidebar.component.html
│       │   │   │   └── sidebar.component.scss
│       │   │   ├── footer/
│       │   │   ├── breadcrumb/
│       │   │   ├── error-alert/
│       │   │   ├── success-alert/
│       │   │   ├── confirmation-dialog/
│       │   │   ├── loading-spinner/
│       │   │   ├── pagination/
│       │   │   ├── data-table/
│       │   │   ├── search-box/
│       │   │   └── filter-panel/
│       │   │
│       │   ├── pipes/
│       │   │   ├── safe.pipe.ts                   # HTML sanitization
│       │   │   ├── truncate.pipe.ts               # Text truncation
│       │   │   ├── safe-url.pipe.ts               # URL sanitization
│       │   │   ├── date-format.pipe.ts            # Custom date format
│       │   │   ├── status-label.pipe.ts           # Status to display text
│       │   │   └── file-size.pipe.ts              # Format file size
│       │   │
│       │   ├── directives/
│       │   │   ├── click-outside.directive.ts     # Detect outside click
│       │   │   ├── debounce.directive.ts          # Debounce input
│       │   │   ├── highlight.directive.ts         # Text highlighting
│       │   │   ├── has-permission.directive.ts    # Show based on permission
│       │   │   ├── auto-focus.directive.ts        # Auto focus input
│       │   │   └── tooltip.directive.ts           # Custom tooltips
│       │   │
│       │   └── models/                            # Shared interfaces
│       │       ├── pagination.model.ts
│       │       ├── filter.model.ts
│       │       └── sort.model.ts
│       │
│       ├── features/                    # Feature modules
│       │   ├── auth/
│       │   │   ├── login/
│       │   │   │   ├── login.component.ts         # Login page
│       │   │   │   ├── login.component.html
│       │   │   │   ├── login.component.scss
│       │   │   │   └── login.service.ts
│       │   │   ├── register/
│       │   │   │   ├── register.component.ts
│       │   │   │   ├── register.component.html
│       │   │   │   └── register.service.ts
│       │   │   ├── forgot-password/
│       │   │   ├── reset-password/
│       │   │   ├── verify-email/
│       │   │   ├── auth.routes.ts                 # Auth feature routes
│       │   │   └── auth.models.ts                 # Auth feature models
│       │   │
│       │   ├── dashboard/
│       │   │   ├── dashboard.component.ts         # Main dashboard
│       │   │   ├── dashboard.component.html
│       │   │   ├── dashboard.service.ts
│       │   │   ├── widgets/
│       │   │   │   ├── stats-card/
│       │   │   │   ├── chart-card/
│       │   │   │   ├── progress-card/
│       │   │   │   └── activity-feed/
│       │   │   ├── dashboard.routes.ts
│       │   │   └── dashboard.models.ts
│       │   │
│       │   ├── programs/
│       │   │   ├── program-list/
│       │   │   │   ├── program-list.component.ts
│       │   │   │   ├── program-list.component.html
│       │   │   │   ├── program-list.service.ts
│       │   │   │   └── program-list.signals.ts    # Signals for this feature
│       │   │   ├── program-detail/
│       │   │   │   ├── program-detail.component.ts
│       │   │   │   ├── program-detail.component.html
│       │   │   │   └── program-detail.service.ts
│       │   │   ├── program-form/
│       │   │   │   ├── program-form.component.ts
│       │   │   │   ├── program-form.component.html
│       │   │   │   └── program-form.validators.ts
│       │   │   ├── program.routes.ts
│       │   │   └── program.models.ts
│       │   │
│       │   ├── courses/
│       │   │   ├── course-list/
│       │   │   ├── course-detail/
│       │   │   ├── course-form/
│       │   │   ├── course-outcomes/
│       │   │   │   ├── course-outcomes.component.ts
│       │   │   │   ├── outcome-mapping-card/
│       │   │   │   └── add-outcome-dialog/
│       │   │   ├── course.routes.ts
│       │   │   ├── course.service.ts
│       │   │   └── course.models.ts
│       │   │
│       │   ├── outcomes/
│       │   │   ├── outcome-list/
│       │   │   ├── outcome-detail/
│       │   │   ├── outcome-form/
│       │   │   ├── outcome-mapping/
│       │   │   ├── outcome.routes.ts
│       │   │   ├── outcome.service.ts
│       │   │   └── outcome.models.ts
│       │   │
│       │   ├── assessments/
│       │   │   ├── assessment-list/
│       │   │   ├── assessment-form/
│       │   │   ├── submit-assessment/
│       │   │   │   ├── submit-assessment.component.ts
│       │   │   │   ├── form-builder/
│       │   │   │   └── response-recorder/
│       │   │   ├── assessment.routes.ts
│       │   │   ├── assessment.service.ts
│       │   │   └── assessment.models.ts
│       │   │
│       │   ├── results/
│       │   │   ├── result-list/
│       │   │   ├── result-detail/
│       │   │   ├── grade-entry/
│       │   │   ├── result.routes.ts
│       │   │   ├── result.service.ts
│       │   │   └── result.models.ts
│       │   │
│       │   ├── reports/
│       │   │   ├── report-dashboard/
│       │   │   │   ├── report-dashboard.component.ts
│       │   │   │   ├── effectiveness-chart/
│       │   │   │   ├── trend-analysis/
│       │   │   │   └── recommendations-panel/
│       │   │   ├── report-generator/
│       │   │   ├── report-viewer/
│       │   │   ├── export-dialog/
│       │   │   ├── report.routes.ts
│       │   │   ├── report.service.ts
│       │   │   └── report.models.ts
│       │   │
│       │   ├── admin/
│       │   │   ├── user-management/
│       │   │   ├── role-management/
│       │   │   ├── system-config/
│       │   │   ├── audit-logs/
│       │   │   ├── admin.routes.ts
│       │   │   ├── admin.service.ts
│       │   │   └── admin.models.ts
│       │   │
│       │   └── users/
│       │       ├── profile/
│       │       ├── settings/
│       │       ├── change-password/
│       │       ├── user.routes.ts
│       │       ├── user.service.ts
│       │       └── user.models.ts
│       │
│       └── layouts/
│           ├── auth-layout/
│           │   ├── auth-layout.component.ts
│           │   ├── auth-layout.component.html
│           │   └── auth-layout.component.scss
│           └── main-layout/
│               ├── main-layout.component.ts
│               ├── main-layout.component.html
│               └── main-layout.component.scss
│
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── icons/
│   │   │   └── backgrounds/
│   │   ├── icons/
│   │   │   ├── courses.svg
│   │   │   ├── outcomes.svg
│   │   │   └── assessments.svg
│   │   └── data/
│   │       └── mock-data.json
│   │
│   ├── fonts/
│   │   ├── roboto/
│   │   └── material-icons/
│   │
│   └── config/
│       ├── environment.json
│       └── theme-config.json
│
├── angular.json                         # Angular CLI config
├── tsconfig.json                        # TypeScript config
├── tsconfig.app.json                    # App TypeScript config
├── tsconfig.spec.json                   # Testing TypeScript config
├── package.json                         # NPM dependencies
└── proxy.conf.json                      # Development proxy config
```

---

## 🔄 State Management with Signals

### **Global Signals Architecture**

```typescript
// src/app/core/state/global.signals.ts

// Authentication State
export const currentUserSignal = signal<User | null>(null);
export const isAuthenticatedSignal = signal<boolean>(false);
export const authLoadingSignal = signal<boolean>(false);
export const authErrorSignal = signal<string | null>(null);

// Tenant State
export const currentTenantSignal = signal<Tenant | null>(null);
export const tenantIdSignal = computed(() => 
  currentTenantSignal()?.id ?? localStorage.getItem('tenantId')
);

// UI State
export const sidebarOpenSignal = signal<boolean>(true);
export const darkModeSignal = signal<boolean>(
  localStorage.getItem('darkMode') === 'true'
);
export const loadingSignal = signal<boolean>(false);
export const notificationsSignal = signal<Notification[]>([]);

// Permission State
export const userPermissionsSignal = signal<Permission[]>([]);
export const canAccessAdminSignal = computed(() =>
  userPermissionsSignal().some(p => p.name === 'ADMIN_ACCESS')
);

// Computed Signals
export const userDisplayNameSignal = computed(() => {
  const user = currentUserSignal();
  return user ? `${user.firstName} ${user.lastName}` : 'Guest';
});

export const unreadNotificationCountSignal = computed(() =>
  notificationsSignal().filter(n => !n.read).length
);
```

### **Feature-Level Signals**

```typescript
// src/app/features/courses/course.signals.ts

export const coursesSignal = signal<Course[]>([]);
export const coursesLoadingSignal = signal<boolean>(false);
export const selectedCourseSignal = signal<Course | null>(null);
export const courseFilterSignal = signal<CourseFilter>({
  searchTerm: '',
  department: '',
  semester: ''
});
export const coursePageSignal = signal<number>(1);

// Computed Signals
export const filteredCoursesSignal = computed(() => {
  const courses = coursesSignal();
  const filter = courseFilterSignal();
  
  return courses.filter(course =>
    (!filter.searchTerm || 
      course.name.toLowerCase().includes(filter.searchTerm.toLowerCase())) &&
    (!filter.department || course.department === filter.department) &&
    (!filter.semester || course.semester === filter.semester)
  );
});

export const paginatedCoursesSignal = computed(() => {
  const filtered = filteredCoursesSignal();
  const page = coursePageSignal();
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  return filtered.slice(start, start + pageSize);
});

export const totalCoursePagesSignal = computed(() =>
  Math.ceil(filteredCoursesSignal().length / 10)
);
```

### **Signal Effects for Side Effects**

```typescript
// Auto-sync to localStorage
effect(() => {
  const user = currentUserSignal();
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
});

// Apply dark mode
effect(() => {
  const isDark = darkModeSignal();
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('darkMode', isDark.toString());
});

// Auto-refresh courses when filter changes
effect(() => {
  const filter = courseFilterSignal();
  loadCourses(filter); // Trigger API call
});
```

---

## 🌐 HTTP Communication Pattern

### **Service Layer Example**

```typescript
// src/app/features/courses/course.service.ts

@Injectable({ providedIn: 'root' })
export class CourseService {
  private apiUrl = '/api/core/courses';

  constructor(private http: HttpClient) {}

  // Fetch courses with caching
  getCourses(filter?: CourseFilter): Observable<Course[]> {
    const params = new HttpParams()
      .set('searchTerm', filter?.searchTerm || '')
      .set('department', filter?.department || '')
      .set('page', filter?.page || '1')
      .set('limit', '100');

    return this.http.get<Course[]>(this.apiUrl, { params }).pipe(
      tap(courses => coursesSignal.set(courses)),
      catchError(error => {
        console.error('Error loading courses:', error);
        return of([]);
      })
    );
  }

  // Create course
  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course).pipe(
      tap(newCourse => {
        const currentCourses = coursesSignal();
        coursesSignal.set([...currentCourses, newCourse]);
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  // Update course
  updateCourse(id: number, updates: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updatedCourse => {
        const courses = coursesSignal();
        const index = courses.findIndex(c => c.id === id);
        if (index !== -1) {
          courses[index] = updatedCourse;
          coursesSignal.set([...courses]);
        }
      })
    );
  }

  // Delete course
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const courses = coursesSignal();
        coursesSignal.set(courses.filter(c => c.id !== id));
      })
    );
  }

  // Get single course with outcomes
  getCourseWithOutcomes(courseId: number): Observable<CourseDetail> {
    return this.http.get<CourseDetail>(
      `${this.apiUrl}/${courseId}/details`
    ).pipe(
      tap(course => selectedCourseSignal.set(course as any))
    );
  }
}
```

### **Component Using Signals**

```typescript
// src/app/features/courses/course-list/course-list.component.ts

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <div class="course-list">
      <!-- Search & Filter -->
      <div class="filters">
        <input 
          type="text" 
          placeholder="Search courses..."
          (input)="onSearchChange($event)"
        />
        <button (click)="loadCourses()">Refresh</button>
        <button (click)="openAddCourseDialog()">+ Add Course</button>
      </div>

      <!-- Loading State -->
      @if (coursesLoadingSignal()) {
        <app-loading-spinner></app-loading-spinner>
      }

      <!-- Courses Table -->
      @if (paginatedCoursesSignal().length > 0) {
        <table mat-table [dataSource]="paginatedCoursesSignal()">
          <!-- Columns -->
          <ng-container matColumnDef="code">
            <th mat-header-cell>Code</th>
            <td mat-cell>{{ course.courseCode }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell>Name</th>
            <td mat-cell>{{ course.courseName }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell>Actions</th>
            <td mat-cell>
              <button (click)="editCourse(course)">Edit</button>
              <button (click)="deleteCourse(course.id)">Delete</button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <!-- Pagination -->
        <mat-paginator
          [length]="filteredCoursesSignal().length"
          [pageSize]="10"
          [pageSizeOptions]="[10, 20, 50]"
          (page)="onPageChange($event)"
        ></mat-paginator>
      }

      <!-- No Results -->
      @if (!coursesLoadingSignal() && paginatedCoursesSignal().length === 0) {
        <div class="no-results">
          No courses found. {{ filteredCoursesSignal().length === 0 ? 
            'Try adjusting your filters.' : 'Create a new course to get started.' }}
        </div>
      }
    </div>
  `
})
export class CourseListComponent implements OnInit {
  // Inject signals
  readonly coursesSignal = inject(coursesSignal);
  readonly coursesLoadingSignal = inject(coursesLoadingSignal);
  readonly filteredCoursesSignal = inject(filteredCoursesSignal);
  readonly paginatedCoursesSignal = inject(paginatedCoursesSignal);

  private courseService = inject(CourseService);
  private dialog = inject(MatDialog);

  displayedColumns = ['code', 'name', 'department', 'credits', 'actions'];

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    coursesLoadingSignal().set(true);
    this.courseService.getCourses().subscribe({
      next: () => coursesLoadingSignal().set(false),
      error: () => coursesLoadingSignal().set(false)
    });
  }

  onSearchChange(event: any): void {
    const searchTerm = event.target.value;
    courseFilterSignal.update(filter => ({
      ...filter,
      searchTerm
    }));
  }

  editCourse(course: Course): void {
    // Open edit dialog
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure?')) {
      coursesLoadingSignal().set(true);
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          coursesLoadingSignal().set(false);
          // Signal will auto-update via service
        }
      });
    }
  }

  onPageChange(event: any): void {
    coursePageSignal.set(event.pageIndex + 1);
  }
}
```

---

## 🎨 Styling Strategy

### **SCSS Architecture**

```scss
// src/styles/variables.scss
$primary-color: #1976d2;
$secondary-color: #ff4081;
$success-color: #4caf50;
$warning-color: #ff9800;
$error-color: #f44336;
$neutral-color: #9e9e9e;

$spacing-unit: 8px;
$spacing-xs: $spacing-unit;
$spacing-sm: $spacing-unit * 2;
$spacing-md: $spacing-unit * 3;
$spacing-lg: $spacing-unit * 4;
$spacing-xl: $spacing-unit * 6;

$font-family: 'Roboto', sans-serif;
$font-size-sm: 12px;
$font-size-base: 14px;
$font-size-lg: 16px;
$font-size-xl: 20px;

$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;

// Dark mode
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #212121;
  --text-secondary: #757575;
}

:root.dark {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
}
```

### **Component Styling**

```scss
// src/app/features/courses/course-list/course-list.component.scss

.course-list {
  padding: var(--spacing-lg);

  .filters {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);

    input {
      flex: 1;
      padding: var(--spacing-sm);
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }

    button {
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: darken(var(--primary-color), 10%);
      }
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: var(--bg-primary);

    th {
      background: var(--bg-secondary);
      padding: var(--spacing-md);
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--border-color);
    }
  }

  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
    }

    table {
      font-size: $font-size-sm;
    }
  }
}
```

---

## 🔐 Security & Best Practices

### **HTTP Interceptors for Security**

```typescript
// src/app/core/interceptors/token.interceptor.ts

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    
    if (token && !this.isPublicEndpoint(req.url)) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }

  private isPublicEndpoint(url: string): boolean {
    const publicEndpoints = ['/api/auth/login', '/api/auth/register'];
    return publicEndpoints.some(endpoint => url.includes(endpoint));
  }
}

// src/app/core/interceptors/error.interceptor.ts

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.handleUnauthorized();
            break;
          case 403:
            this.notificationService.error('Access denied');
            break;
          case 404:
            this.notificationService.error('Resource not found');
            break;
          case 500:
            this.notificationService.error('Server error. Please try again.');
            break;
          default:
            this.notificationService.error('An error occurred');
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorized(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/auth/login']);
  }
}
```

---

## 📱 Responsive Design

### **Mobile-First Approach**

```scss
// Mobile (default)
.dashboard {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-md;
}

// Tablet
@media (min-width: $breakpoint-md) {
  .dashboard {
    grid-template-columns: repeat(2, 1fr);
  }
}

// Desktop
@media (min-width: $breakpoint-lg) {
  .dashboard {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## ⚡ Performance Optimization

### **Bundle Optimization**

```typescript
// Lazy Loading Routes
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/courses/course-list.component')
      .then(m => m.CourseListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES),
    canActivate: [AuthGuard, AdminGuard]
  }
];
```

### **Image Optimization**

```html
<!-- Use modern image formats with fallbacks -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.png" type="image/png">
  <img src="image.png" alt="Course thumbnail" loading="lazy">
</picture>
```

---

## ✅ Testing Strategy

### **Unit Testing Components**

```typescript
// src/app/features/courses/course-list.component.spec.ts

describe('CourseListComponent', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  let courseService: jasmine.SpyObj<CourseService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseListComponent],
      providers: [
        {
          provide: CourseService,
          useValue: jasmine.createSpyObj('CourseService', ['getCourses'])
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
    courseService = TestBed.inject(CourseService) as any;
  });

  it('should load courses on init', () => {
    const mockCourses = [
      { id: 1, courseCode: 'CS101', courseName: 'Intro to CS' }
    ];
    courseService.getCourses.and.returnValue(of(mockCourses));

    component.ngOnInit();

    expect(courseService.getCourses).toHaveBeenCalled();
  });
});
```

---

## 🚀 Deployment

### **Production Build**

```bash
# Build for production
ng build --configuration production --optimization --stats-json

# Analyze bundle
webpack-bundle-analyzer dist/objectbasedoutcome/stats.json
```

### **Docker Deployment**

```dockerfile
# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist/objectbasedoutcome /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📊 Frontend Success Metrics

✅ **Performance:**
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Bundle size < 500KB (gzipped)

✅ **User Experience:**
- 90% pages responsive
- 4.5+ user satisfaction
- < 1% error rate

✅ **Accessibility:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatible

---

**Frontend is ready for development!** 🎉

