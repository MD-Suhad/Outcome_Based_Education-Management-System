import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./features/courses/courses.component').then(m => m.CoursesComponent)
      },
      {
        path: 'programs/outcomes',
        loadComponent: () => import('./features/programs/program-outcomes.component').then(m => m.ProgramOutcomesComponent)
      },
      {
        path: 'outcomes/matrix',
        loadComponent: () => import('./features/outcomes/copo-mapping.component').then(m => m.CoPoMappingComponent)
      },
      {
        path: 'assessments',
        loadComponent: () => import('./features/assessments/assessment-manager.component').then(m => m.AssessmentManagerComponent)
      },
      {
        path: 'results/attainment',
        loadComponent: () => import('./features/results/attainment-analytics.component').then(m => m.AttainmentAnalyticsComponent)
      },
      {
        path: 'ai-assistant',
        loadComponent: () => import('./features/ai-assistant/ai-assistant.component').then(m => m.AiAssistantComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications-center.component').then(m => m.NotificationsCenterComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'departments',
        loadComponent: () => import('./features/departments/department-list.component').then(m => m.DepartmentListComponent)
      },
      {
        path: 'students/bulk-upload',
        loadComponent: () => import('./features/students/student-bulk-upload.component').then(m => m.StudentBulkUploadComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
