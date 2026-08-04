import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AiMappingSuggestion {
  coCode: string;
  coStatement: string;
  recommendedPlo: string;
  recommendedWeight: number; // 1, 2, 3
  bloomsTaxonomy: string;
  confidenceScore: number; // e.g. 94%
  rationale: string;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="header-title">🤖 AI Curriculum CO-PO Alignment Assistant</h1>
          <p class="header-subtitle">LLM-Powered Outcome Analysis, Bloom's Taxonomy Classification & Mapping Recommendations</p>
        </div>
        <span class="ai-badge">Powered by DeepSeek / Gemini AI</span>
      </div>

      <!-- Syllabus Analysis Input Box -->
      <div class="analysis-box">
        <h3>Paste Course Syllabus / Objective Text</h3>
        <p>Our AI model will analyze your course objectives, classify Bloom's Taxonomy cognitive levels, and predict Washington Accord PLO mapping weights.</p>
        
        <textarea 
          rows="4" 
          placeholder="e.g. Students will learn to design distributed database systems with Spring Boot microservices, optimizing SQL query locks, MVCC concurrency, and high availability..."
          [(ngModel)]="syllabusInput"
        ></textarea>

        <div class="box-actions">
          <button class="btn-ai" (click)="analyzeSyllabus()" [disabled]="isAnalyzing()">
            <span *ngIf="!isAnalyzing()">✨ Analyze Syllabus & Generate Mappings</span>
            <span *ngIf="isAnalyzing()">⚡ AI Processing Syllabi...</span>
          </button>
        </div>
      </div>

      <!-- AI Suggestions Results Card -->
      <div class="results-container" *ngIf="suggestions().length > 0">
        <div class="results-header">
          <h3>Generated CO-PO Alignment Suggestions</h3>
          <span class="count-badge">{{ suggestions().length }} Outcomes Processed</span>
        </div>

        <div class="suggestions-grid">
          <div class="suggestion-card" *ngFor="let item of suggestions()">
            <div class="card-top">
              <span class="co-tag">{{ item.coCode }}</span>
              <span class="blooms-chip">{{ item.bloomsTaxonomy }}</span>
              <span class="confidence-tag">Confidence: {{ item.confidenceScore }}%</span>
            </div>

            <p class="co-text">"{{ item.coStatement }}"</p>

            <div class="mapping-recommendation">
              <div class="rec-label">Recommended Mapping:</div>
              <div class="rec-val">
                <span class="plo-pill">{{ item.recommendedPlo }}</span>
                <span class="weight-badge level-3">Weight {{ item.recommendedWeight }} (High Correlation)</span>
              </div>
            </div>

            <div class="rationale-box">
              <strong>AI Rationale:</strong> {{ item.rationale }}
            </div>

            <div class="card-actions">
              <button class="btn-accept" (click)="acceptSuggestion(item)">✓ Accept & Apply Matrix</button>
              <button class="btn-reject">✕ Modify</button>
            </div>
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
    .ai-badge {
      background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
      color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 800;
      box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
    }

    .analysis-box {
      background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(16px);
      border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 20px; padding: 1.5rem;
    }
    .analysis-box h3 { font-size: 1.1rem; font-weight: 700; color: #f8fafc; margin: 0 0 0.4rem 0; }
    .analysis-box p { font-size: 0.88rem; color: #94a3b8; margin: 0 0 1rem 0; }

    textarea {
      width: 100%; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px; padding: 1rem; color: white; font-family: inherit; font-size: 0.92rem; outline: none;
      box-sizing: border-box; resize: vertical; margin-bottom: 1rem;
    }
    textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }

    .box-actions { display: flex; justify-content: flex-end; }
    .btn-ai {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4); transition: all 0.2s;
    }
    .btn-ai:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(99, 102, 241, 0.6); }

    .results-container { display: flex; flex-direction: column; gap: 1rem; }
    .results-header { display: flex; justify-content: space-between; align-items: center; }
    .results-header h3 { font-size: 1.15rem; font-weight: 700; color: #f8fafc; margin: 0; }
    .count-badge { background: rgba(99, 102, 241, 0.2); color: #818cf8; font-weight: 700; font-size: 0.8rem; padding: 0.25rem 0.6rem; border-radius: 20px; }

    .suggestions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.25rem; }
    .suggestion-card {
      background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.25rem;
      display: flex; flex-direction: column; gap: 0.9rem;
    }
    .card-top { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
    .co-tag { background: #6366f1; color: white; font-weight: 800; font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 6px; }
    .blooms-chip { background: rgba(236, 72, 153, 0.15); color: #f472b6; font-weight: 700; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 6px; }
    .confidence-tag { margin-left: auto; color: #34d399; font-weight: 700; font-size: 0.78rem; }

    .co-text { font-size: 0.9rem; color: #f8fafc; line-height: 1.4; font-style: italic; margin: 0; }
    .mapping-recommendation { background: rgba(15, 23, 42, 0.6); padding: 0.75rem; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; }
    .rec-label { font-size: 0.8rem; color: #94a3b8; font-weight: 600; }
    .rec-val { display: flex; align-items: center; gap: 0.5rem; }
    .plo-pill { background: rgba(99, 102, 241, 0.2); color: #818cf8; font-weight: 800; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; }
    .weight-badge.level-3 { background: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 700; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; }

    .rationale-box { font-size: 0.8rem; color: #cbd5e1; line-height: 1.4; background: rgba(255, 255, 255, 0.03); padding: 0.75rem; border-radius: 8px; }
    .card-actions { display: flex; gap: 0.6rem; justify-content: flex-end; }
    .btn-accept { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 0.45rem 0.85rem; border-radius: 8px; font-weight: 700; font-size: 0.8rem; cursor: pointer; }
    .btn-reject { background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.1); padding: 0.45rem 0.85rem; border-radius: 8px; font-weight: 600; font-size: 0.8rem; cursor: pointer; }
  `]
})
export class AiAssistantComponent {
  protected syllabusInput = 'Students will analyze software requirements, design modern microservices architectures using Spring Boot, and evaluate database concurrency locks, MVCC transactions, and high availability system performance.';
  protected isAnalyzing = signal<boolean>(false);

  protected suggestions = signal<AiMappingSuggestion[]>([
    {
      coCode: 'CO1',
      coStatement: 'Analyze software requirements and design modern scalable software architecture.',
      recommendedPlo: 'PLO-1: Engineering Knowledge',
      recommendedWeight: 3,
      bloomsTaxonomy: 'C4 - Analysis',
      confidenceScore: 96,
      rationale: 'Keywords "analyze requirements" and "design architecture" directly map to engineering analysis and foundational system design.'
    },
    {
      coCode: 'CO2',
      coStatement: 'Implement secure microservices using Spring Boot & Angular Signals framework.',
      recommendedPlo: 'PLO-3: Design & Development',
      recommendedWeight: 3,
      bloomsTaxonomy: 'C3 - Application',
      confidenceScore: 92,
      rationale: 'Hands-on implementation of enterprise framework services aligns strongly with solution development PLO criteria.'
    },
    {
      coCode: 'CO3',
      coStatement: 'Evaluate database indexing, query locks, and MVCC concurrency performance.',
      recommendedPlo: 'PLO-4: Conduct Investigations',
      recommendedWeight: 3,
      bloomsTaxonomy: 'C5 - Evaluation',
      confidenceScore: 94,
      rationale: 'Performance benchmarking and lock evaluation fall into empirical investigation and cognitive evaluation level C5.'
    }
  ]);

  protected analyzeSyllabus(): void {
    this.isAnalyzing.set(true);
    setTimeout(() => {
      this.isAnalyzing.set(false);
    }, 1200);
  }

  protected acceptSuggestion(item: AiMappingSuggestion): void {
    alert(`Suggestion for ${item.coCode} accepted and applied to CO-PO Matrix!`);
  }
}
