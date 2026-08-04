import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { currentUserSignal } from '../../../core/state/global.signals';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Welcome Hero Banner -->
      <div class="welcome-banner" *ngIf="currentUserSignal() as user">
        <div class="welcome-text">
          <h2>Welcome Back, {{ user.firstName || 'Educator' }}! 🎓</h2>
          <p>Outcome-Based Education Management System (OBE-MS) — Track curriculum alignment, PLO attainment, and accreditation compliance.</p>
        </div>
        <div class="quick-actions-hero">
          <a routerLink="/dashboard/outcomes/matrix" class="hero-btn primary">
            <span class="material-icons">grid_on</span>
            <span>CO-PO Matrix</span>
          </a>
          <a routerLink="/dashboard/results/attainment" class="hero-btn secondary">
            <span class="material-icons">analytics</span>
            <span>Attainment CQI</span>
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon bg-indigo">
            <span class="material-icons">menu_book</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">12</span>
            <span class="stat-label">Active OBE Courses</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-purple">
            <span class="material-icons">track_changes</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">12</span>
            <span class="stat-label">Washington Accord PLOs</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-green">
            <span class="material-icons">assignment_turned_in</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">94.2%</span>
            <span class="stat-label">CLO Target Attainment</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-cyan">
            <span class="material-icons">cloud_upload</span>
          </div>
          <div class="stat-content">
            <span class="stat-value">450</span>
            <span class="stat-label">Enrolled Students</span>
          </div>
        </div>
      </div>

      <!-- Quick Module Navigation Shortcuts -->
      <div class="shortcuts-section">
        <h3 class="section-title">Core OBE Workflows</h3>
        <div class="shortcuts-grid">
          <a routerLink="/dashboard/programs/outcomes" class="shortcut-card">
            <div class="shortcut-icon purple">🎯</div>
            <div class="shortcut-info">
              <h4>Program PLOs</h4>
              <p>Define Program Learning Outcomes & Taxonomies</p>
            </div>
            <span class="shortcut-arrow">→</span>
          </a>

          <a routerLink="/dashboard/outcomes/matrix" class="shortcut-card">
            <div class="shortcut-icon indigo">🧩</div>
            <div class="shortcut-info">
              <h4>CO-PO Mapping Matrix</h4>
              <p>Interactive correlation matrix & Bloom's level mapping</p>
            </div>
            <span class="shortcut-arrow">→</span>
          </a>

          <a routerLink="/dashboard/assessments" class="shortcut-card">
            <div class="shortcut-icon emerald">📝</div>
            <div class="shortcut-info">
              <h4>Assessments & Rubrics</h4>
              <p>Exam mapping & multi-tier evaluation rubric builder</p>
            </div>
            <span class="shortcut-arrow">→</span>
          </a>

          <a routerLink="/dashboard/results/attainment" class="shortcut-card">
            <div class="shortcut-icon cyan">📊</div>
            <div class="shortcut-info">
              <h4>Attainment & CQI</h4>
              <p>Direct attainment engine & gap intervention reports</p>
            </div>
            <span class="shortcut-arrow">→</span>
          </a>
        </div>
      </div>

      <!-- Quick Overview Panels -->
      <div class="obe-overview">
        <div class="card">
          <h3>Program Learning Outcomes (PLO) Attainment</h3>
          <p>Real-time achievement percentage across core engineering knowledge and design domains.</p>
          <ul class="plo-list">
            <li>
              <div class="plo-meta">
                <strong>PLO-1: Engineering Knowledge</strong>
                <span class="plo-score green">78.4% Achieved</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width: 78.4%"></div></div>
            </li>
            <li>
              <div class="plo-meta">
                <strong>PLO-2: Problem Analysis</strong>
                <span class="plo-score green">72.1% Achieved</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width: 72.1%"></div></div>
            </li>
            <li>
              <div class="plo-meta">
                <strong>PLO-3: Design & Development of Solutions</strong>
                <span class="plo-score amber">66.5% (CQI Review)</span>
              </div>
              <div class="progress-bar"><div class="progress-fill warn" style="width: 66.5%"></div></div>
            </li>
          </ul>
        </div>

        <div class="card">
          <h3>Continuous Quality Improvement (CQI) Alerts</h3>
          <p>Automated systemic recommendations based on student score attainments.</p>
          <div class="info-block">
            <span class="material-icons info-icon">error_outline</span>
            <span class="info-text">CSE-301 CO3 (Database Locks) scored 5.8% below target threshold. Action recommended for next term syllabus design.</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .welcome-banner {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
      padding: 2rem;
      backdrop-filter: blur(16px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
    }
    .welcome-text h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.85rem;
      font-weight: 800;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
    }
    .welcome-text p {
      margin: 0;
      color: #cbd5e1;
      font-size: 0.95rem;
      max-width: 600px;
      line-height: 1.5;
    }
    .quick-actions-hero { display: flex; gap: 0.75rem; }
    .hero-btn {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.75rem 1.25rem; border-radius: 12px;
      font-weight: 700; text-decoration: none; font-size: 0.9rem;
      transition: all 0.2s;
    }
    .hero-btn.primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white; box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
    }
    .hero-btn.secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white; border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .hero-btn:hover { transform: translateY(-2px); }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }
    .stat-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      backdrop-filter: blur(16px);
    }
    .stat-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; color: white;
    }
    .bg-indigo { background: rgba(99, 102, 241, 0.2); color: #818cf8; }
    .bg-purple { background: rgba(168, 85, 247, 0.2); color: #c084fc; }
    .bg-green { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .bg-cyan { background: rgba(6, 182, 212, 0.2); color: #22d3ee; }

    .stat-content { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 800; color: #f8fafc; font-family: 'Outfit', sans-serif; }
    .stat-label { font-size: 0.82rem; color: #94a3b8; font-weight: 500; }

    .section-title { font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 700; color: #f8fafc; margin: 0 0 1rem 0; }
    .shortcuts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; }
    .shortcut-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      transition: all 0.25s ease;
    }
    .shortcut-card:hover {
      background: rgba(30, 41, 59, 0.8);
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
    .shortcut-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
    }
    .shortcut-icon.purple { background: rgba(168, 85, 247, 0.15); }
    .shortcut-icon.indigo { background: rgba(99, 102, 241, 0.15); }
    .shortcut-icon.emerald { background: rgba(16, 185, 129, 0.15); }
    .shortcut-icon.cyan { background: rgba(6, 182, 212, 0.15); }

    .shortcut-info h4 { font-size: 0.95rem; font-weight: 700; color: #f8fafc; margin: 0 0 0.25rem 0; }
    .shortcut-info p { font-size: 0.78rem; color: #94a3b8; margin: 0; line-height: 1.3; }
    .shortcut-arrow { margin-left: auto; color: #818cf8; font-weight: 800; font-size: 1.1rem; }

    .obe-overview { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.5rem; }
    .card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(16px);
    }
    .card h3 { margin: 0 0 0.5rem 0; font-size: 1.15rem; color: #f8fafc; font-family: 'Outfit', sans-serif; font-weight: 700; }
    .card p { font-size: 0.88rem; color: #94a3b8; margin-bottom: 1.25rem; }

    .plo-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
    .plo-meta { display: flex; justify-content: space-between; font-size: 0.85rem; }
    .plo-meta strong { color: #f8fafc; }
    .plo-score { font-weight: 700; }
    .plo-score.green { color: #34d399; }
    .plo-score.amber { color: #fbbf24; }

    .progress-bar { height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden; margin-top: 0.4rem; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); border-radius: 4px; }
    .progress-fill.warn { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

    .info-block {
      display: flex; align-items: flex-start; gap: 0.75rem;
      background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 1rem; border-radius: 12px;
    }
    .info-icon { color: #fbbf24; }
    .info-text { font-size: 0.85rem; color: #fde68a; line-height: 1.4; }
  `]
})
export class HomeComponent {
  protected authService = inject(AuthService);
  protected currentUserSignal = currentUserSignal;
}

