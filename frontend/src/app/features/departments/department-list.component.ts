import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultyService, Faculty } from '../../core/services/faculty.service';
import { DepartmentService, Department } from '../../core/services/department.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dept-page-container">
      <div class="page-header">
        <div>
          <h2 class="title">Faculties & Departments Setup</h2>
          <p class="subtitle">Manage academic units, faculties, and department organization structure.</p>
        </div>
        <div class="actions">
          <button (click)="openFacultyModal()" class="btn btn-secondary">+ New Faculty</button>
          <button (click)="openDeptModal()" class="btn btn-primary">+ New Department</button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="icon">🏛️</span>
          <div>
            <div class="stat-value">{{ faculties().length }}</div>
            <div class="stat-label">Total Faculties</div>
          </div>
        </div>
        <div class="stat-card">
          <span class="icon">🏫</span>
          <div>
            <div class="stat-value">{{ departments().length }}</div>
            <div class="stat-label">Total Departments</div>
          </div>
        </div>
      </div>

      <!-- Department List Table -->
      <div class="card">
        <div class="card-header">
          <h3>Departments Directory</h3>
          <div class="filter-box">
            <label>Filter by Faculty: </label>
            <select [ngModel]="selectedFacultyFilter()" (ngModelChange)="onFilterFacultyChange($event)" class="form-select">
              <option [value]="null">All Faculties</option>
              <option *ngFor="let f of faculties()" [value]="f.id">{{ f.name }} ({{ f.code }})</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Department Name</th>
              <th>Faculty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let dept of departments()">
              <td><span class="badge">{{ dept.code }}</span></td>
              <td class="font-medium">{{ dept.name }}</td>
              <td>{{ dept.facultyName || 'Unassigned' }}</td>
              <td>
                <button (click)="deleteDepartment(dept.id!)" class="btn-icon text-danger" title="Delete">🗑️</button>
              </td>
            </tr>
            <tr *ngIf="departments().length === 0">
              <td colspan="4" class="empty-state">No departments found. Create a new department to get started.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create Department Modal -->
      <div class="modal-backdrop" *ngIf="showDeptModal()">
        <div class="modal">
          <h3>Add New Department</h3>
          <div class="form-group">
            <label>Department Code *</label>
            <input type="text" [(ngModel)]="newDept.code" placeholder="e.g. CSE" class="form-control" />
          </div>
          <div class="form-group">
            <label>Department Name *</label>
            <input type="text" [(ngModel)]="newDept.name" placeholder="e.g. Computer Science & Engineering" class="form-control" />
          </div>
          <div class="form-group">
            <label>Assign Faculty *</label>
            <select [(ngModel)]="newDept.facultyId" class="form-control">
              <option [ngValue]="undefined">-- Select Faculty --</option>
              <option *ngFor="let f of faculties()" [ngValue]="f.id">{{ f.name }}</option>
            </select>
          </div>
          <div class="modal-actions">
            <button (click)="closeDeptModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="saveDepartment()" class="btn btn-primary" [disabled]="!newDept.name || !newDept.code">Save Department</button>
          </div>
        </div>
      </div>

      <!-- Create Faculty Modal -->
      <div class="modal-backdrop" *ngIf="showFacultyModal()">
        <div class="modal">
          <h3>Add New Faculty</h3>
          <div class="form-group">
            <label>Faculty Code *</label>
            <input type="text" [(ngModel)]="newFaculty.code" placeholder="e.g. FSE" class="form-control" />
          </div>
          <div class="form-group">
            <label>Faculty Name *</label>
            <input type="text" [(ngModel)]="newFaculty.name" placeholder="e.g. Faculty of Science & Engineering" class="form-control" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="newFaculty.description" placeholder="Faculty description..." class="form-control"></textarea>
          </div>
          <div class="modal-actions">
            <button (click)="closeFacultyModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="saveFaculty()" class="btn btn-primary" [disabled]="!newFaculty.name || !newFaculty.code">Save Faculty</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dept-page-container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 700; color: #1e293b; margin: 0; }
    .subtitle { color: #64748b; margin-top: 4px; font-size: 14px; }
    .actions { display: flex; gap: 12px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: white; padding: 20px; border-radius: 12px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-card .icon { font-size: 32px; }
    .stat-value { font-size: 24px; font-weight: 700; color: #0f172a; }
    .stat-label { color: #64748b; font-size: 13px; }
    .card { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 20px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; }
    .data-table th, .data-table td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; }
    .data-table th { background: #f8fafc; color: #475569; font-weight: 600; font-size: 13px; }
    .badge { background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 12px; }
    .btn { padding: 8px 16px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: 0.2s; }
    .btn-primary { background: #2563eb; color: white; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-secondary { background: #f1f5f9; color: #334155; }
    .btn-secondary:hover { background: #e2e8f0; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 16px; }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 24px; border-radius: 12px; width: 420px; max-width: 90%; }
    .form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px; }
    .form-control, .form-select { padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
    .empty-state { text-align: center; color: #94a3b8; padding: 32px; }
  `]
})
export class DepartmentListComponent implements OnInit {
  faculties = signal<Faculty[]>([]);
  departments = signal<Department[]>([]);
  selectedFacultyFilter = signal<number | null>(null);

  showDeptModal = signal<boolean>(false);
  showFacultyModal = signal<boolean>(false);

  newFaculty: Faculty = { name: '', code: '', description: '' };
  newDept: Department = { name: '', code: '' };

  constructor(
    private facultyService: FacultyService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadFaculties();
    this.loadDepartments();
  }

  loadFaculties(): void {
    this.facultyService.getAll().subscribe(data => this.faculties.set(data));
  }

  loadDepartments(): void {
    const filter = this.selectedFacultyFilter();
    this.departmentService.getAll(filter || undefined).subscribe(data => this.departments.set(data));
  }

  onFilterFacultyChange(facultyId: number | null): void {
    this.selectedFacultyFilter.set(facultyId);
    this.loadDepartments();
  }

  openDeptModal(): void {
    this.newDept = { name: '', code: '' };
    this.showDeptModal.set(true);
  }

  closeDeptModal(): void {
    this.showDeptModal.set(false);
  }

  saveDepartment(): void {
    this.departmentService.create(this.newDept).subscribe(() => {
      this.closeDeptModal();
      this.loadDepartments();
    });
  }

  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.delete(id).subscribe(() => this.loadDepartments());
    }
  }

  openFacultyModal(): void {
    this.newFaculty = { name: '', code: '', description: '' };
    this.showFacultyModal.set(true);
  }

  closeFacultyModal(): void {
    this.showFacultyModal.set(false);
  }

  saveFaculty(): void {
    this.facultyService.create(this.newFaculty).subscribe(() => {
      this.closeFacultyModal();
      this.loadFaculties();
    });
  }
}
