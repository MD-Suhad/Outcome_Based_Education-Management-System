import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ProgramOutcome {
  id: string;
  code: string;
  title: string;
  description: string;
  taxonomy: 'Cognitive' | 'Affective' | 'Psychomotor';
  targetAttainment: number; // percentage, e.g. 70
  currentAttainment: number;
  status: 'Achieved' | 'On Track' | 'Needs Improvement';
}

@Component({
  selector: 'app-program-outcomes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="header-title">Program Learning Outcomes (PLOs)</h1>
          <p class="header-subtitle">Washington Accord & Outcome-Based Education (OBE) Standard Program Criteria</p>
        </div>
        <button class="btn-primary" (click)="openAddModal()">
          <span class="icon">+</span> Define New PLO
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon purple">🎯</div>
          <div class="stat-info">
            <span class="stat-value">12</span>
            <span class="stat-label">Total Core PLOs</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon emerald">✓</div>
          <div class="stat-info">
            <span class="stat-value">9</span>
            <span class="stat-label">Target Achieved</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">⚠️</div>
          <div class="stat-info">
            <span class="stat-value">3</span>
            <span class="stat-label">CQI Review Required</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon cyan">📊</div>
          <div class="stat-info">
            <span class="stat-value">74.8%</span>
            <span class="stat-label">Average Attainment</span>
          </div>
        </div>
      </div>

      <!-- PLO Table List -->
      <div class="table-container">
        <div class="table-header-tools">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search PLO code or statement..." [(ngModel)]="searchQuery" />
          </div>
          <div class="filter-group">
            <select [(ngModel)]="selectedTaxonomy">
              <option value="ALL">All Taxonomies</option>
              <option value="Cognitive">Cognitive Domain</option>
              <option value="Affective">Affective Domain</option>
              <option value="Psychomotor">Psychomotor Domain</option>
            </select>
          </div>
        </div>

        <table class="custom-table">
          <thead>
            <tr>
              <th>PLO Code</th>
              <th>Outcome Statement & Description</th>
              <th>Domain</th>
              <th>Target</th>
              <th>Current Attainment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let plo of filteredPlos()">
              <td>
                <span class="plo-badge">{{ plo.code }}</span>
              </td>
              <td>
                <div class="plo-details">
                  <span class="plo-title">{{ plo.title }}</span>
                  <span class="plo-desc">{{ plo.description }}</span>
                </div>
              </td>
              <td>
                <span class="taxonomy-chip" [class]="plo.taxonomy.toLowerCase()">
                  {{ plo.taxonomy }}
                </span>
              </td>
              <td><strong>{{ plo.targetAttainment }}%</strong></td>
              <td>
                <div class="progress-cell">
                  <div class="progress-bar-bg">
                    <div 
                      class="progress-bar-fill"
                      [style.width.%]="plo.currentAttainment"
                      [class.emerald]="plo.currentAttainment >= plo.targetAttainment"
                      [class.amber]="plo.currentAttainment < plo.targetAttainment"
                    ></div>
                  </div>
                  <span class="progress-val">{{ plo.currentAttainment }}%</span>
                </div>
              </td>
              <td>
                <span class="status-badge" [class]="plo.status.toLowerCase().replace(' ', '-')">
                  {{ plo.status }}
                </span>
              </td>
              <td>
                <button class="btn-icon" title="Edit PLO">✏️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.75rem;
      font-weight: 800;
      color: #f8fafc;
      margin: 0 0 0.25rem 0;
    }
    .header-subtitle {
      color: #94a3b8;
      font-size: 0.9rem;
      margin: 0;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
      transition: all 0.2s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 25px rgba(99, 102, 241, 0.5);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }
    .stat-card {
      background: rgba(30, 41, 59, 0.5);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
    }
    .stat-icon.purple { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
    .stat-icon.emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .stat-icon.amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .stat-icon.cyan { background: rgba(6, 182, 212, 0.15); color: #22d3ee; }

    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.4rem; font-weight: 800; color: #f8fafc; font-family: 'Outfit', sans-serif; }
    .stat-label { font-size: 0.8rem; color: #94a3b8; font-weight: 500; }

    .table-container {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 1.5rem;
    }
    .table-header-tools {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      gap: 1rem;
    }
    .search-box {
      position: relative;
      flex: 1;
      max-width: 380px;
    }
    .search-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.6;
    }
    .search-box input {
      width: 100%;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 0.6rem 1rem 0.6rem 2.5rem;
      color: white;
      outline: none;
    }
    .filter-group select {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 0.6rem 1rem;
      color: white;
      outline: none;
    }

    .custom-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .custom-table th {
      padding: 1rem;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .custom-table td {
      padding: 1.1rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
      font-size: 0.9rem;
    }
    .plo-badge {
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.4);
      padding: 0.35rem 0.65rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
    }
    .plo-details { display: flex; flex-direction: column; gap: 0.2rem; }
    .plo-title { font-weight: 700; color: #f8fafc; }
    .plo-desc { font-size: 0.8rem; color: #94a3b8; line-height: 1.4; }

    .taxonomy-chip {
      padding: 0.25rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .taxonomy-chip.cognitive { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .taxonomy-chip.affective { background: rgba(236, 72, 153, 0.15); color: #f472b6; }
    .taxonomy-chip.psychomotor { background: rgba(168, 85, 247, 0.15); color: #c084fc; }

    .progress-cell { display: flex; align-items: center; gap: 0.75rem; }
    .progress-bar-bg {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      min-width: 100px;
    }
    .progress-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.4s ease;
    }
    .progress-bar-fill.emerald { background: linear-gradient(90deg, #10b981, #34d399); }
    .progress-bar-fill.amber { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

    .status-badge {
      padding: 0.3rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .status-badge.achieved { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .status-badge.on-track { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .status-badge.needs-improvement { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.3rem;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .btn-icon:hover { background: rgba(255, 255, 255, 0.1); }
  `]
})
export class ProgramOutcomesComponent {
  protected searchQuery = '';
  protected selectedTaxonomy = 'ALL';

  protected plos = signal<ProgramOutcome[]>([
    {
      id: '1',
      code: 'PLO-1',
      title: 'Engineering Knowledge',
      description: 'Apply knowledge of mathematics, natural science, and computing fundamentals to solve complex engineering problems.',
      taxonomy: 'Cognitive',
      targetAttainment: 70,
      currentAttainment: 78.4,
      status: 'Achieved'
    },
    {
      id: '2',
      code: 'PLO-2',
      title: 'Problem Analysis',
      description: 'Identify, formulate, research literature, and analyze complex engineering problems reaching substantiated conclusions.',
      taxonomy: 'Cognitive',
      targetAttainment: 70,
      currentAttainment: 72.1,
      status: 'Achieved'
    },
    {
      id: '3',
      code: 'PLO-3',
      title: 'Design & Development of Solutions',
      description: 'Design system components or processes that meet specified needs with appropriate consideration for public health and safety.',
      taxonomy: 'Cognitive',
      targetAttainment: 70,
      currentAttainment: 66.5,
      status: 'Needs Improvement'
    },
    {
      id: '4',
      code: 'PLO-4',
      title: 'Conduct Investigations',
      description: 'Use research-based knowledge and methodologies including design of experiments, analysis, and synthesis of data.',
      taxonomy: 'Psychomotor',
      targetAttainment: 65,
      currentAttainment: 74.0,
      status: 'Achieved'
    },
    {
      id: '5',
      code: 'PLO-5',
      title: 'Ethics & Professional Conduct',
      description: 'Apply ethical principles and commit to professional ethics and responsibilities of engineering practice.',
      taxonomy: 'Affective',
      targetAttainment: 75,
      currentAttainment: 82.3,
      status: 'Achieved'
    }
  ]);

  protected filteredPlos(): ProgramOutcome[] {
    return this.plos().filter(plo => {
      const matchesSearch = plo.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            plo.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesTaxonomy = this.selectedTaxonomy === 'ALL' || plo.taxonomy === this.selectedTaxonomy;
      return matchesSearch && matchesTaxonomy;
    });
  }

  protected openAddModal(): void {
    alert('PLO Creation Modal: Define new Washington Accord Outcome Statement');
  }
}
