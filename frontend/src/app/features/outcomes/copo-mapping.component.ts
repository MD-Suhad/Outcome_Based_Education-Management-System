import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/notification/notification.service';
import { FormsModule } from '@angular/forms';

export interface CourseOutcomeItem {
  id: string;
  code: string; // e.g. CO1, CO2
  description: string;
  bloomsLevel: string; // e.g. C3 - Application
  poMappings: { [ploCode: string]: number }; // e.g. { 'PLO-1': 3, 'PLO-2': 2 }
}

@Component({
  selector: 'app-copo-mapping',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="header-title">CO-PO Matrix Mapping</h1>
          <p class="header-subtitle">Map Course Outcomes (COs) to Program Learning Outcomes (PLOs) & Bloom's Taxonomy</p>
        </div>
        <div class="header-actions">
          <select class="course-select" [(ngModel)]="selectedCourse">
            <option value="CSE-301">CSE-301: Software Engineering</option>
            <option value="CSE-302">CSE-302: Database Systems</option>
            <option value="CSE-401">CSE-401: Distributed Systems</option>
          </select>
          <button class="btn-save" (click)="saveMappings()">💾 Save Matrix</button>
        </div>
      </div>

      <!-- Mapping Guidance Legend -->
      <div class="legend-card">
        <div class="legend-title">Mapping Scale (OBE Standard):</div>
        <div class="legend-items">
          <span class="legend-badge level-3">3 = High Correlation</span>
          <span class="legend-badge level-2">2 = Medium Correlation</span>
          <span class="legend-badge level-1">1 = Low Correlation</span>
          <span class="legend-badge level-0">- = No Direct Correlation</span>
        </div>
      </div>

      <!-- CO-PO Interactive Grid Matrix -->
      <div class="matrix-card">
        <div class="table-wrapper">
          <table class="matrix-table">
            <thead>
              <tr>
                <th class="sticky-col">Course Outcome (CO)</th>
                <th>Bloom's Taxonomy</th>
                <th *ngFor="let plo of plos">{{ plo }}</th>
                <th>CO Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let co of courseOutcomes()">
                <td class="sticky-col co-cell">
                  <div class="co-info">
                    <span class="co-badge">{{ co.code }}</span>
                    <span class="co-desc">{{ co.description }}</span>
                  </div>
                </td>
                <td>
                  <span class="blooms-tag">{{ co.bloomsLevel }}</span>
                </td>
                <td *ngFor="let plo of plos" class="cell-align-center">
                  <select 
                    class="mapping-select"
                    [class.val-3]="co.poMappings[plo] === 3"
                    [class.val-2]="co.poMappings[plo] === 2"
                    [class.val-1]="co.poMappings[plo] === 1"
                    [(ngModel)]="co.poMappings[plo]"
                  >
                    <option [ngValue]="0">-</option>
                    <option [ngValue]="1">1 (Low)</option>
                    <option [ngValue]="2">2 (Med)</option>
                    <option [ngValue]="3">3 (High)</option>
                  </select>
                </td>
                <td>
                  <span class="weight-total">{{ calculateCoWeight(co) }}</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="sticky-col total-label">PLO Contribution Average:</td>
                <td *ngFor="let plo of plos" class="cell-align-center total-val">
                  {{ calculatePloAverage(plo) }}
                </td>
                <td>-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Outcome Alignment Summary Card -->
      <div class="summary-grid">
        <div class="summary-card">
          <h3>📌 Curriculum Alignment Checklist</h3>
          <ul class="checklist">
            <li class="checked">Every Course Outcome (CO) maps to at least one primary PLO.</li>
            <li class="checked">Bloom's Taxonomy includes higher-level cognitive levels (C3-C5).</li>
            <li class="warning">PLO-3 (Design) has low average correlation weight (Requires CQI adjustment).</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; }
    .header-title { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 800; color: #f8fafc; margin: 0 0 0.25rem 0; }
    .header-subtitle { color: #94a3b8; font-size: 0.9rem; margin: 0; }

    .header-actions { display: flex; gap: 1rem; align-items: center; }
    .course-select {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      color: white;
      padding: 0.7rem 1rem;
      font-weight: 600;
      outline: none;
    }
    .btn-save {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      padding: 0.7rem 1.25rem;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
      transition: all 0.2s;
    }
    .btn-save:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(16, 185, 129, 0.5); }

    .legend-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .legend-title { font-size: 0.85rem; font-weight: 700; color: #cbd5e1; }
    .legend-items { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .legend-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
    }
    .level-3 { background: rgba(99, 102, 241, 0.25); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.4); }
    .level-2 { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
    .level-1 { background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.2); }
    .level-0 { background: rgba(255, 255, 255, 0.05); color: #64748b; }

    .matrix-card {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 1.25rem;
      overflow: hidden;
    }
    .table-wrapper { overflow-x: auto; }
    .matrix-table { width: 100%; border-collapse: collapse; text-align: left; }
    .matrix-table th {
      padding: 1rem;
      font-size: 0.8rem;
      color: #64748b;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      text-transform: uppercase;
    }
    .matrix-table td {
      padding: 0.9rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
    }
    .sticky-col { position: sticky; left: 0; background: #0f172a; z-index: 2; min-width: 280px; }

    .co-badge {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      margin-bottom: 0.2rem;
      display: inline-block;
    }
    .co-desc { font-size: 0.8rem; color: #94a3b8; line-height: 1.3; display: block; }
    .blooms-tag {
      background: rgba(236, 72, 153, 0.15);
      color: #f472b6;
      border: 1px solid rgba(236, 72, 153, 0.3);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .cell-align-center { text-align: center; }
    .mapping-select {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: white;
      padding: 0.4rem 0.5rem;
      font-weight: 700;
      outline: none;
      cursor: pointer;
      text-align: center;
    }
    .mapping-select.val-3 { background: rgba(99, 102, 241, 0.3); border-color: #6366f1; color: #a5b4fc; }
    .mapping-select.val-2 { background: rgba(59, 130, 246, 0.25); border-color: #3b82f6; color: #93c5fd; }
    .mapping-select.val-1 { background: rgba(148, 163, 184, 0.2); border-color: #64748b; color: #e2e8f0; }

    .weight-total { font-weight: 800; color: #38bdf8; }
    .total-label { font-weight: 700; color: #cbd5e1; text-align: right; }
    .total-val { font-weight: 800; color: #34d399; font-size: 0.95rem; }

    .summary-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
    .summary-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.25rem;
    }
    .summary-card h3 { font-size: 1rem; font-weight: 700; color: #f8fafc; margin: 0 0 0.8rem 0; }
    .checklist { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
    .checklist li { font-size: 0.85rem; color: #94a3b8; display: flex; align-items: center; gap: 0.5rem; }
    .checklist li.checked::before { content: '✓'; color: #34d399; font-weight: 800; }
    .checklist li.warning::before { content: '⚠️'; }
  `]
})
export class CoPoMappingComponent {
  protected selectedCourse = 'CSE-301';
  protected plos = ['PLO-1', 'PLO-2', 'PLO-3', 'PLO-4', 'PLO-5', 'PLO-6'];

  protected courseOutcomes = signal<CourseOutcomeItem[]>([
    {
      id: 'c1',
      code: 'CO1',
      description: 'Analyze software requirements and design modern scalable software architecture.',
      bloomsLevel: 'C4 - Analysis',
      poMappings: { 'PLO-1': 3, 'PLO-2': 3, 'PLO-3': 2, 'PLO-4': 1, 'PLO-5': 0, 'PLO-6': 0 }
    },
    {
      id: 'c2',
      code: 'CO2',
      description: 'Implement secure microservices using Spring Boot & Angular Signals framework.',
      bloomsLevel: 'C3 - Application',
      poMappings: { 'PLO-1': 3, 'PLO-2': 2, 'PLO-3': 3, 'PLO-4': 2, 'PLO-5': 1, 'PLO-6': 0 }
    },
    {
      id: 'c3',
      code: 'CO3',
      description: 'Evaluate database indexing, query locks, and MVCC concurrency performance.',
      bloomsLevel: 'C5 - Evaluation',
      poMappings: { 'PLO-1': 2, 'PLO-2': 3, 'PLO-3': 1, 'PLO-4': 3, 'PLO-5': 0, 'PLO-6': 0 }
    },
    {
      id: 'c4',
      code: 'CO4',
      description: 'Demonstrate ethical coding standards and collaborative Agile team practices.',
      bloomsLevel: 'A3 - Valuing',
      poMappings: { 'PLO-1': 0, 'PLO-2': 0, 'PLO-3': 0, 'PLO-4': 0, 'PLO-5': 3, 'PLO-6': 2 }
    }
  ]);

  private notifService = inject(NotificationService);

  protected calculateCoWeight(co: CourseOutcomeItem): number {
    return Object.values(co.poMappings).reduce((acc, val) => acc + val, 0);
  }

  protected calculatePloAverage(plo: string): string {
    const list = this.courseOutcomes();
    const sum = list.reduce((acc, co) => acc + (co.poMappings[plo] || 0), 0);
    return (sum / list.length).toFixed(1);
  }

  protected saveMappings(): void {
    this.notifService.showSuccess(
      'Matrix Saved Successfully',
      `CO-PO correlation weights for ${this.selectedCourse} have been saved.`
    );
  }
}
