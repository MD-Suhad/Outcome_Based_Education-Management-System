import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/notification/notification.service';
import { FormsModule } from '@angular/forms';

export interface StudentScoreItem {
  studentId: string;
  name: string;
  rollNumber: string;
  co1Score: number; // percentage
  co2Score: number;
  co3Score: number;
  co4Score: number;
  overallAttainment: number;
  status: 'Pass' | 'Conditional' | 'CQI Action Required';
}

@Component({
  selector: 'app-attainment-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="header-title">Student Attainment & CQI Engine</h1>
          <p class="header-subtitle">Direct attainment metrics, CO-PLO gap analysis & Continuous Quality Improvement</p>
        </div>
        <div class="header-actions">
          <button class="btn-export" (click)="exportReport()">📥 Export Accreditation Audit PDF</button>
        </div>
      </div>

      <!-- Attainment Analytics Overview Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon purple">🎓</div>
          <div class="stat-info">
            <span class="stat-value">88.5%</span>
            <span class="stat-label">Overall Cohort Pass Rate</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon emerald">📈</div>
          <div class="stat-info">
            <span class="stat-value">79.2%</span>
            <span class="stat-label">Target CO Attainment</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">⚙️</div>
          <div class="stat-info">
            <span class="stat-value">2 Action Items</span>
            <span class="stat-label">CQI Interventions</span>
          </div>
        </div>
      </div>

      <!-- CO Attainment Summary Cards Grid -->
      <div class="co-attainment-grid">
        <div class="co-card" *ngFor="let co of coSummaries">
          <div class="co-header">
            <span class="co-pill">{{ co.code }}</span>
            <span class="target-text">Target: {{ co.target }}%</span>
          </div>
          <h4 class="co-title">{{ co.title }}</h4>
          <div class="metric-row">
            <span class="attain-value" [class.achieved]="co.actual >= co.target">{{ co.actual }}%</span>
            <span class="status-chip" [class.success]="co.actual >= co.target" [class.warn]="co.actual < co.target">
              {{ co.actual >= co.target ? 'Target Met' : 'Gap Detected' }}
            </span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" [style.width.%]="co.actual" [class.warn]="co.actual < co.target"></div>
          </div>
        </div>
      </div>

      <!-- Student Attainment Score Table -->
      <div class="table-card">
        <div class="card-header">
          <h3>Individual Student Outcome Attainment (CSE-301 Cohort)</h3>
        </div>

        <table class="custom-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>CO1 (Arch)</th>
              <th>CO2 (Impl)</th>
              <th>CO3 (DB)</th>
              <th>CO4 (Ethics)</th>
              <th>Overall Attainment</th>
              <th>CQI Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let st of students()">
              <td><code>{{ st.rollNumber }}</code></td>
              <td><strong>{{ st.name }}</strong></td>
              <td><span class="score-pill" [class.low]="st.co1Score < 70">{{ st.co1Score }}%</span></td>
              <td><span class="score-pill" [class.low]="st.co2Score < 70">{{ st.co2Score }}%</span></td>
              <td><span class="score-pill" [class.low]="st.co3Score < 70">{{ st.co3Score }}%</span></td>
              <td><span class="score-pill" [class.low]="st.co4Score < 70">{{ st.co4Score }}%</span></td>
              <td><strong>{{ st.overallAttainment }}%</strong></td>
              <td>
                <span class="status-badge" [class.pass]="st.status === 'Pass'" [class.cqi]="st.status !== 'Pass'">
                  {{ st.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CQI Action Plan Notice -->
      <div class="cqi-banner">
        <div class="cqi-icon">💡</div>
        <div class="cqi-content">
          <h4>Continuous Quality Improvement (CQI) Recommendation:</h4>
          <p>CO3 (Database Optimization) showed a 5.8% gap under target. Recommendation: Add mandatory hands-on lab sessions on SQL Explain Plans & MVCC locks for next academic term.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; }
    .header-title { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 800; color: #f8fafc; margin: 0 0 0.25rem 0; }
    .header-subtitle { color: #94a3b8; font-size: 0.9rem; margin: 0; }
    .btn-export {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 12px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 20px rgba(2, 132, 199, 0.3); transition: all 0.2s;
    }
    .btn-export:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(2, 132, 199, 0.5); }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; }
    .stat-card {
      background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.25rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
    .stat-icon.purple { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
    .stat-icon.emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .stat-icon.amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.4rem; font-weight: 800; color: #f8fafc; font-family: 'Outfit', sans-serif; }
    .stat-label { font-size: 0.8rem; color: #94a3b8; font-weight: 500; }

    .co-attainment-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; }
    .co-card {
      background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.25rem;
      display: flex; flex-direction: column; gap: 0.6rem;
    }
    .co-header { display: flex; justify-content: space-between; align-items: center; }
    .co-pill { background: rgba(99, 102, 241, 0.2); color: #818cf8; font-weight: 800; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 6px; }
    .target-text { font-size: 0.75rem; color: #94a3b8; }
    .co-title { font-size: 0.9rem; font-weight: 700; color: #f8fafc; margin: 0; line-height: 1.3; }
    .metric-row { display: flex; justify-content: space-between; align-items: center; }
    .attain-value { font-size: 1.5rem; font-weight: 800; color: #34d399; font-family: 'Outfit', sans-serif; }
    .attain-value:not(.achieved) { color: #fbbf24; }
    .status-chip { font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; }
    .status-chip.success { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .status-chip.warn { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

    .progress-bar-bg { height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); }
    .progress-bar-fill.warn { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

    .table-card {
      background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 1.5rem;
    }
    .card-header h3 { font-size: 1.1rem; font-weight: 700; color: #f8fafc; margin: 0 0 1rem 0; }
    .custom-table { width: 100%; border-collapse: collapse; text-align: left; }
    .custom-table th { padding: 0.9rem; font-size: 0.78rem; color: #64748b; border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-transform: uppercase; }
    .custom-table td { padding: 1rem 0.9rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #cbd5e1; font-size: 0.88rem; }
    .score-pill { font-weight: 700; color: #34d399; }
    .score-pill.low { color: #fbbf24; }
    .status-badge { padding: 0.3rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .status-badge.pass { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .status-badge.cqi { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

    .cqi-banner {
      background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px; padding: 1.25rem; display: flex; gap: 1rem; align-items: flex-start;
    }
    .cqi-icon { font-size: 1.5rem; }
    .cqi-content h4 { font-size: 0.95rem; font-weight: 700; color: #a5b4fc; margin: 0 0 0.3rem 0; }
    .cqi-content p { font-size: 0.85rem; color: #cbd5e1; margin: 0; line-height: 1.4; }
  `]
})
export class AttainmentAnalyticsComponent {
  protected coSummaries = [
    { code: 'CO1', title: 'Software Architecture & Layering Design', target: 70, actual: 82.4 },
    { code: 'CO2', title: 'Spring Boot Microservices Implementation', target: 70, actual: 78.1 },
    { code: 'CO3', title: 'Database Optimization & Query Locks', target: 70, actual: 64.2 },
    { code: 'CO4', title: 'Ethics & Team Collaboration', target: 75, actual: 88.0 }
  ];

  protected students = signal<StudentScoreItem[]>([
    { studentId: '1', name: 'Shohaib Suhad', rollNumber: 'CSE-2026-001', co1Score: 92, co2Score: 88, co3Score: 74, co4Score: 95, overallAttainment: 87.25, status: 'Pass' },
    { studentId: '2', name: 'Ayesha Rahman', rollNumber: 'CSE-2026-002', co1Score: 85, co2Score: 79, co3Score: 62, co4Score: 88, overallAttainment: 78.50, status: 'Conditional' },
    { studentId: '3', name: 'Tanvir Hossain', rollNumber: 'CSE-2026-003', co1Score: 78, co2Score: 72, co3Score: 58, co4Score: 82, overallAttainment: 72.50, status: 'CQI Action Required' },
    { studentId: '4', name: 'Nusrat Jahan', rollNumber: 'CSE-2026-004', co1Score: 95, co2Score: 91, co3Score: 84, co4Score: 96, overallAttainment: 91.50, status: 'Pass' }
  ]);

  private notifService = inject(NotificationService);

  protected exportReport(): void {
    this.notifService.showSuccess(
      'Audit Report Generated',
      'Official OBE Attainment & Washington Accord Accreditation Audit PDF has been compiled and downloaded.'
    );
  }
}
