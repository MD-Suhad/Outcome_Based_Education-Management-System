import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { currentUserSignal } from '../../../core/state/global.signals';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="welcome-banner" *ngIf="currentUserSignal() as user">
        <h2>Welcome Back, {{ user.firstName || 'Educator' }}!</h2>
        <p>Manage and map your Outcome-Based Education parameters, curriculum metrics, and student attainment.</p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon bg-indigo">
            <span class="material-icons">menu_book</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">12</span>
            <span class="stat-label">Active Courses</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-purple">
            <span class="material-icons">architecture</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">5</span>
            <span class="stat-label">Core Program Outcomes</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-green">
            <span class="material-icons">assignment_turned_in</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">94.2%</span>
            <span class="stat-label">CLO Attainment</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions / OBE Status -->
      <div class="obe-overview">
        <div class="card">
          <h3>Program Learning Outcomes (PLO) Status</h3>
          <p>Outcome mapping helps align course syllabus design with general institution program criteria.</p>
          <ul class="plo-list">
            <li>
              <strong>PLO-1: Engineering Knowledge</strong>
              <div class="progress-bar"><div class="progress-fill" style="width: 85%"></div></div>
            </li>
            <li>
              <strong>PLO-2: Problem Analysis</strong>
              <div class="progress-bar"><div class="progress-fill" style="width: 72%"></div></div>
            </li>
            <li>
              <strong>PLO-3: Design & Development</strong>
              <div class="progress-bar"><div class="progress-fill" style="width: 90%"></div></div>
            </li>
          </ul>
        </div>

        <div class="card">
          <h3>OBE Management Overview</h3>
          <p>Track student performance metrics against Course Learning Outcomes (CLOs) and Course Objectives.</p>
          <div class="info-block">
            <span class="material-icons info-icon">info</span>
            <span class="info-text">You have 2 courses requiring Course Outcomes mapping reviews for the upcoming term.</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .welcome-banner {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 12px;
      padding: 2rem;
      backdrop-filter: blur(10px);
    }
    .welcome-banner h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--logo-text-main);
      font-family: 'Outfit', sans-serif;
    }
    .welcome-banner p {
      margin: 0;
      color: var(--subtitle-text);
      font-size: 1rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: var(--card-shadow);
      backdrop-filter: blur(10px);
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .bg-indigo { background: #4f46e5; }
    .bg-purple { background: #7c3aed; }
    .bg-green { background: #10b981; }
    .stat-content {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--logo-text-main);
      font-family: 'Outfit', sans-serif;
    }
    .stat-label {
      font-size: 0.85rem;
      color: var(--subtitle-text);
    }
    .obe-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 1.5rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: var(--card-shadow);
      backdrop-filter: blur(10px);
    }
    .card h3 {
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
      color: var(--logo-text-main);
      font-family: 'Outfit', sans-serif;
    }
    .card p {
      font-size: 0.9rem;
      color: var(--subtitle-text);
      margin-bottom: 1.5rem;
    }
    .plo-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .plo-list li {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .plo-list strong {
      font-size: 0.85rem;
      color: var(--logo-text-main);
    }
    .progress-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #a855f7);
      border-radius: 4px;
    }
    .info-block {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.15);
      padding: 1rem;
      border-radius: 8px;
    }
    .info-icon {
      color: #6366f1;
    }
    .info-text {
      font-size: 0.85rem;
      color: var(--logo-text-main);
    }
  `]
})
export class HomeComponent {
  protected authService = inject(AuthService);
  protected currentUserSignal = currentUserSignal;
}
