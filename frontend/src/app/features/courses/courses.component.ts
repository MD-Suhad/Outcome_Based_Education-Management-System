import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Course {
  code: string;
  name: string;
  credits: number;
  clos: string[];
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="courses-container">
      <div class="header">
        <h2>OBE Course Outcomes & Mapping</h2>
        <p>Define courses, specify Course Learning Outcomes (CLOs), and link them to Program Outcomes.</p>
      </div>

      <div class="courses-grid">
        <div *ngFor="let course of courses()" class="course-card">
          <div class="course-header">
            <span class="course-code">{{ course.code }}</span>
            <h4>{{ course.name }}</h4>
          </div>
          <div class="course-body">
            <p><strong>Credits:</strong> {{ course.credits }} Credits</p>
            <div class="clos-section">
              <h5>Course Learning Outcomes:</h5>
              <ul>
                <li *ngFor="let clo of course.clos">{{ clo }}</li>
              </ul>
            </div>
          </div>
          <div class="course-footer">
            <button class="btn-action">Edit Mapping</button>
            <button class="btn-action outline">View Details</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .courses-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--logo-text-main);
      font-family: 'Outfit', sans-serif;
    }
    .header p {
      margin: 0;
      color: var(--subtitle-text);
      font-size: 0.95rem;
    }
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .course-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: var(--card-shadow);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      backdrop-filter: blur(10px);
    }
    .course-header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .course-code {
      font-size: 0.8rem;
      font-weight: 600;
      color: #6366f1;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .course-header h4 {
      margin: 0;
      font-size: 1.15rem;
      color: var(--logo-text-main);
      font-family: 'Outfit', sans-serif;
    }
    .course-body {
      flex: 1;
      font-size: 0.9rem;
      color: var(--subtitle-text);
    }
    .clos-section {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .clos-section h5 {
      margin: 0;
      font-size: 0.85rem;
      color: var(--logo-text-main);
      font-weight: 600;
    }
    .clos-section ul {
      padding-left: 1.25rem;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .course-footer {
      display: flex;
      gap: 0.75rem;
    }
    .btn-action {
      flex: 1;
      padding: 0.6rem;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      background: #6366f1;
      color: white;
      transition: all 0.2s;
    }
    .btn-action:hover {
      box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
    }
    .btn-action.outline {
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--logo-text-main);
    }
    .btn-action.outline:hover {
      background: rgba(255, 255, 255, 0.03);
    }
  `]
})
export class CoursesComponent {
  protected courses = signal<Course[]>([
    {
      code: 'CSE-301',
      name: 'Software Engineering & Design Patterns',
      credits: 3,
      clos: [
        'CLO-1: Formulate system requirements into clean OOP patterns.',
        'CLO-2: Analyze coupling & cohesion properties in software projects.',
        'CLO-3: Design modular web systems using MVC frameworks.'
      ]
    },
    {
      code: 'CSE-302',
      name: 'Database Management Systems',
      credits: 4,
      clos: [
        'CLO-1: Map relational database schemas into 3NF models.',
        'CLO-2: Formulate optimized SQL select statements with indexing.',
        'CLO-3: Implement ACID transaction safety models.'
      ]
    },
    {
      code: 'CSE-401',
      name: 'Artificial Intelligence & Machine Learning',
      credits: 3,
      clos: [
        'CLO-1: Understand search graph heuristics and optimizations.',
        'CLO-2: Fit supervised classifiers on tabular datasets.',
        'CLO-3: Evaluate deep neural systems using cross validation.'
      ]
    }
  ]);
}
