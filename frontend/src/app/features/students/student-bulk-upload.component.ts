import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService, Department } from '../../core/services/department.service';
import { StudentService, BulkUploadResult } from '../../core/services/student.service';

@Component({
  selector: 'app-student-bulk-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="upload-page-container">
      <div class="page-header">
        <div>
          <h2 class="title">Student Excel Bulk Upload</h2>
          <p class="subtitle">Import batches of student profiles into departments using formatted Excel (.xlsx) files.</p>
        </div>
        <button (click)="downloadTemplate()" class="btn btn-secondary">
          📥 Download Excel Template
        </button>
      </div>

      <!-- Step 1 & Upload Card -->
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label font-bold">1. Select Target Department *</label>
              <select [(ngModel)]="selectedDepartmentId" class="form-select">
                <option [ngValue]="null">-- Select Department --</option>
                <option *ngFor="let dept of departments()" [ngValue]="dept.id">
                  {{ dept.name }} ({{ dept.code }})
                </option>
              </select>
            </div>
          </div>

          <div class="dropzone"
               (dragover)="onDragOver($event)"
               (dragleave)="onDragLeave($event)"
               (drop)="onDrop($event)"
               [class.dragging]="isDragging()"
               [class.disabled]="!selectedDepartmentId">
            <span class="upload-icon">📊</span>
            <h4>Drag & Drop Excel (.xlsx) File Here</h4>
            <p>or click to browse your computer</p>
            <input type="file" #fileInput (change)="onFileSelected($event)" accept=".xlsx, .xls" style="display: none" />
            <button (click)="fileInput.click()" class="btn btn-primary" [disabled]="!selectedDepartmentId">
              Browse File
            </button>
          </div>

          <div *ngIf="selectedFile()" class="selected-file-info">
            <span class="file-name">📄 {{ selectedFile()?.name }}</span>
            <span class="file-size">({{ (selectedFile()!.size / 1024).toFixed(1) }} KB)</span>
            <button (click)="uploadFile()" class="btn btn-success" [disabled]="isUploading()">
              {{ isUploading() ? 'Processing Excel...' : 'Upload & Import Students' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Upload Results Section -->
      <div *ngIf="uploadResult()" class="results-container">
        <div class="summary-cards">
          <div class="summary-card bg-info">
            <div class="value">{{ uploadResult()?.totalRowsProcessed }}</div>
            <div class="label">Rows Processed</div>
          </div>
          <div class="summary-card bg-success">
            <div class="value">{{ uploadResult()?.successCount }}</div>
            <div class="label">Successfully Imported</div>
          </div>
          <div class="summary-card bg-danger">
            <div class="value">{{ uploadResult()?.failureCount }}</div>
            <div class="label">Failed Rows</div>
          </div>
        </div>

        <!-- Validation Errors Table -->
        <div *ngIf="uploadResult()!.errors.length > 0" class="card mt-4">
          <div class="card-header danger-header">
            <h3>⚠️ Validation Warnings & Errors</h3>
          </div>
          <table class="error-table">
            <thead>
              <tr>
                <th>Excel Row</th>
                <th>Student ID</th>
                <th>Error Message</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let err of uploadResult()!.errors">
                <td><span class="badge-row">Row #{{ err.rowNumber }}</span></td>
                <td><strong>{{ err.studentId || 'N/A' }}</strong></td>
                <td class="text-danger">{{ err.errorMessage }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-page-container { padding: 24px; max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 700; color: #1e293b; margin: 0; }
    .subtitle { color: #64748b; margin-top: 4px; font-size: 14px; }
    .card { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 24px; margin-bottom: 24px; }
    .form-group { margin-bottom: 20px; max-width: 400px; }
    .form-label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 600; color: #334155; }
    .form-select { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; }
    .dropzone { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 40px; text-align: center; background: #f8fafc; transition: 0.2s; }
    .dropzone.dragging { background: #eff6ff; border-color: #3b82f6; }
    .dropzone.disabled { opacity: 0.5; pointer-events: none; }
    .upload-icon { font-size: 48px; display: block; margin-bottom: 12px; }
    .dropzone h4 { margin: 0 0 4px; color: #1e293b; font-size: 16px; }
    .dropzone p { margin: 0 0 16px; color: #64748b; font-size: 13px; }
    .selected-file-info { display: flex; align-items: center; gap: 12px; margin-top: 16px; padding: 12px; background: #f1f5f9; border-radius: 8px; }
    .file-name { font-weight: 600; color: #0f172a; }
    .file-size { color: #64748b; font-size: 13px; }
    .btn { padding: 8px 16px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: 0.2s; }
    .btn-primary { background: #2563eb; color: white; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-secondary { background: #f1f5f9; color: #334155; }
    .btn-success { background: #16a34a; color: white; }
    .btn-success:hover { background: #15803d; }
    .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .summary-card { padding: 20px; border-radius: 12px; color: white; text-align: center; }
    .bg-info { background: #0284c7; }
    .bg-success { background: #16a34a; }
    .bg-danger { background: #dc2626; }
    .summary-card .value { font-size: 28px; font-weight: 700; }
    .summary-card .label { font-size: 13px; opacity: 0.9; }
    .error-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .error-table th, .error-table td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; text-align: left; }
    .error-table th { background: #fef2f2; color: #991b1b; font-size: 13px; }
    .badge-row { background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .text-danger { color: #dc2626; }
    .mt-4 { margin-top: 24px; }
  `]
})
export class StudentBulkUploadComponent implements OnInit {
  departments = signal<Department[]>([]);
  selectedDepartmentId: number | null = null;
  selectedFile = signal<File | null>(null);

  isDragging = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  uploadResult = signal<BulkUploadResult | null>(null);

  constructor(
    private departmentService: DepartmentService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.departmentService.getAll().subscribe(data => this.departments.set(data));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile.set(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile.set(event.target.files[0]);
    }
  }

  uploadFile(): void {
    if (!this.selectedFile() || !this.selectedDepartmentId) return;

    this.isUploading.set(true);
    this.studentService.bulkUpload(this.selectedFile()!, this.selectedDepartmentId)
      .subscribe({
        next: (result) => {
          this.uploadResult.set(result);
          this.isUploading.set(false);
        },
        error: (err) => {
          alert('Upload failed: ' + (err.error?.message || err.message));
          this.isUploading.set(false);
        }
      });
  }

  downloadTemplate(): void {
    this.studentService.downloadTemplate().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_upload_template.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
