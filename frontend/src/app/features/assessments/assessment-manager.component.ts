import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AssessmentItem {
  id: string;
  name: string;
  type: 'Exam' | 'Quiz' | 'Assignment' | 'Project' | 'Presentation';
  totalMarks: number;
  weightage: number; // percentage
  targetCo: string; // e.g. CO1, CO2
  rubricLevels: number; // e.g. 4 levels
}

@Component({
  selector: 'app-assessment-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="header-title">Assessments & Rubric Builder</h1>
          <p class="header-subtitle">Configure exams, assignments, project rubrics, and map questions to COs</p>
        </div>
        <button class="btn-primary" (click)="openAddModal()">
          <span class="icon">+</span> Create Assessment
        </button>
      </div>

      <!-- Assessment Summary Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon purple">📝</div>
          <div class="stat-info">
            <span class="stat-value">6</span>
            <span class="stat-label">Active Assessments</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon emerald">💯</div>
          <div class="stat-info">
            <span class="stat-value">100%</span>
            <span class="stat-label">Total Course Weightage</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon cyan">📊</div>
          <div class="stat-info">
            <span class="stat-value">4 COs</span>
            <span class="stat-label">COs Covered</span>
          </div>
        </div>
      </div>

      <!-- Assessment List & Rubric Configurator -->
      <div class="content-grid">
        <!-- Left: Assessment List -->
        <div class="card-panel">
          <div class="panel-header">
            <h3>Assessment Scheme (CSE-301)</h3>
          </div>

          <div class="assessment-list">
            <div 
              *ngFor="let item of assessments()" 
              class="assessment-card"
              [class.active]="selectedAssessment()?.id === item.id"
              (click)="selectAssessment(item)"
            >
              <div class="card-top">
                <span class="type-badge" [class]="item.type.toLowerCase()">{{ item.type }}</span>
                <span class="co-link">Mapped to {{ item.targetCo }}</span>
              </div>
              <h4 class="item-name">{{ item.name }}</h4>
              <div class="card-bottom">
                <span>Marks: <strong>{{ item.totalMarks }}</strong></span>
                <span>Weight: <strong>{{ item.weightage }}%</strong></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Rubric Criterion Builder Preview -->
        <div class="card-panel" *ngIf="selectedAssessment() as sel">
          <div class="panel-header">
            <h3>Evaluation Rubric: {{ sel.name }}</h3>
            <span class="co-pill">Target: {{ sel.targetCo }}</span>
          </div>

          <div class="rubric-table-wrapper">
            <table class="rubric-table">
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>Exemplary (4)</th>
                  <th>Proficient (3)</th>
                  <th>Developing (2)</th>
                  <th>Unsatisfactory (1)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="criteria-cell">
                    <strong>Architectural Cleanliness</strong>
                    <span class="crit-sub">Layering & Design Patterns</span>
                  </td>
                  <td>Demonstrates clean Spring Boot package-by-feature design with 0 coupling.</td>
                  <td>Proper layering with minor entity leakage into DTOs.</td>
                  <td>Monolithic controller with business logic mixed in.</td>
                  <td>Single file code with no separation of concerns.</td>
                </tr>
                <tr>
                  <td class="criteria-cell">
                    <strong>Concurrency & Locking</strong>
                    <span class="crit-sub">Thread Safety & Race Conditions</span>
                  </td>
                  <td>Uses atomic locks & optimistic locking with zero deadlocks.</td>
                  <td>Uses standard synchronized blocks with minor latency.</td>
                  <td>Unhandled race conditions during high concurrent traffic.</td>
                  <td>Data corruption under concurrent score updates.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="rubric-footer">
            <button class="btn-outline">✏️ Edit Rubric Criteria</button>
            <button class="btn-primary-sm">✅ Confirm & Publish Rubric</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; }
    .header-title { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 800; color: #f8fafc; margin: 0 0 0.25rem 0; }
    .header-subtitle { color: #94a3b8; font-size: 0.9rem; margin: 0; }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 12px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3); transition: all 0.2s;
    }
    .btn-primary:hover { transform: translateY(-2px); }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; }
    .stat-card {
      background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.25rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
    .stat-icon.purple { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
    .stat-icon.emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .stat-icon.cyan { background: rgba(6, 182, 212, 0.15); color: #22d3ee; }

    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.4rem; font-weight: 800; color: #f8fafc; font-family: 'Outfit', sans-serif; }
    .stat-label { font-size: 0.8rem; color: #94a3b8; font-weight: 500; }

    .content-grid { display: grid; grid-template-columns: 340px 1fr; gap: 1.5rem; }
    @media (max-width: 900px) { .content-grid { grid-template-columns: 1fr; } }

    .card-panel {
      background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 1.25rem;
    }
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .panel-header h3 { font-size: 1rem; font-weight: 700; color: #f8fafc; margin: 0; }
    .co-pill { background: rgba(99, 102, 241, 0.2); color: #818cf8; font-weight: 700; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 20px; }

    .assessment-list { display: flex; flex-direction: column; gap: 0.8rem; }
    .assessment-card {
      background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px; padding: 1rem; cursor: pointer; transition: all 0.2s;
    }
    .assessment-card:hover { background: rgba(30, 41, 59, 0.8); border-color: rgba(99, 102, 241, 0.4); }
    .assessment-card.active { border-color: #6366f1; background: rgba(99, 102, 241, 0.15); box-shadow: 0 4px 14px rgba(99, 102, 241, 0.2); }

    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
    .type-badge { font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase; }
    .type-badge.exam { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
    .type-badge.project { background: rgba(168, 85, 247, 0.2); color: #e9d5ff; }
    .type-badge.assignment { background: rgba(59, 130, 246, 0.2); color: #bfdbfe; }
    .type-badge.quiz { background: rgba(245, 158, 11, 0.2); color: #fde68a; }

    .co-link { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
    .item-name { font-size: 0.95rem; font-weight: 700; color: #f8fafc; margin: 0 0 0.5rem 0; }
    .card-bottom { display: flex; justify-content: space-between; font-size: 0.8rem; color: #94a3b8; }

    .rubric-table-wrapper { overflow-x: auto; margin-bottom: 1rem; }
    .rubric-table { width: 100%; border-collapse: collapse; text-align: left; }
    .rubric-table th { padding: 0.8rem; font-size: 0.75rem; color: #64748b; border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-transform: uppercase; }
    .rubric-table td { padding: 0.9rem 0.8rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.82rem; color: #cbd5e1; vertical-align: top; }
    .criteria-cell { width: 25%; }
    .crit-sub { font-size: 0.75rem; color: #94a3b8; display: block; margin-top: 0.2rem; }

    .rubric-footer { display: flex; justify-content: flex-end; gap: 0.75rem; }
    .btn-outline { background: none; border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-primary-sm { background: #6366f1; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; cursor: pointer; }
  `]
})
export class AssessmentManagerComponent {
  protected assessments = signal<AssessmentItem[]>([
    { id: '1', name: 'Midterm Practical Exam', type: 'Exam', totalMarks: 50, weightage: 25, targetCo: 'CO1', rubricLevels: 4 },
    { id: '2', name: 'Microservices Architecture Capstone', type: 'Project', totalMarks: 100, weightage: 35, targetCo: 'CO2', rubricLevels: 4 },
    { id: '3', name: 'Database Query Optimization Quiz', type: 'Quiz', totalMarks: 20, weightage: 10, targetCo: 'CO3', rubricLevels: 4 },
    { id: '4', name: 'Final Comprehensive Exam', type: 'Exam', totalMarks: 100, weightage: 30, targetCo: 'CO4', rubricLevels: 4 }
  ]);

  protected selectedAssessment = signal<AssessmentItem | null>(this.assessments()[1]);

  protected selectAssessment(item: AssessmentItem): void {
    this.selectedAssessment.set(item);
  }

  protected openAddModal(): void {
    alert('Create new assessment form');
  }
}
