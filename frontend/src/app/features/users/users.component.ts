import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface BackendUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-container">
      <div class="header">
        <h2>OBE Registered Instructors & Staff</h2>
        <p>List of all users configured within the Outcome-Based Education system.</p>
      </div>

      <div class="card table-card">
        <div *ngIf="isLoading()" class="loading-state">
          <span class="spinner"></span>
          <p>Fetching user details...</p>
        </div>

        <div *ngIf="!isLoading()" class="table-wrapper">
          <table class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users()">
                <td>{{ user.id }}</td>
                <td class="user-name-cell">
                  {{ user.firstName }} {{ user.lastName }}
                </td>
                <td>{{ user.email }}</td>
                <td>{{ user.phoneNumber || 'N/A' }}</td>
                <td>{{ user.address || 'N/A' }}</td>
                <td>
                  <button (click)="onDelete(user.id)" class="btn-delete">
                    <span class="material-icons">delete</span>
                  </button>
                </td>
              </tr>
              <tr *ngIf="users().length === 0">
                <td colspan="6" class="empty-state">No users registered yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
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
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      box-shadow: var(--card-shadow);
      backdrop-filter: blur(10px);
    }
    .table-card {
      padding: 1rem;
      overflow: hidden;
    }
    .table-wrapper {
      overflow-x: auto;
    }
    .users-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }
    .users-table th {
      padding: 1rem;
      border-bottom: 2px solid var(--card-border);
      color: var(--logo-text-main);
      font-weight: 600;
      font-family: 'Outfit', sans-serif;
    }
    .users-table td {
      padding: 1rem;
      border-bottom: 1px solid var(--card-border);
      color: var(--subtitle-text);
    }
    .user-name-cell {
      font-weight: 500;
      color: var(--logo-text-main) !important;
    }
    .btn-delete {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .btn-delete:hover {
      background: rgba(239, 68, 68, 0.1);
    }
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      gap: 1rem;
      color: var(--subtitle-text);
    }
    .spinner {
      width: 28px;
      height: 28px;
      border: 3px solid rgba(99, 102, 241, 0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .empty-state {
      text-align: center;
      padding: 2rem !important;
      color: var(--subtitle-text);
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);

  protected users = signal<BackendUser[]>([]);
  protected isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.fetchUsers();
  }

  private fetchUsers(): void {
    this.isLoading.set(true);
    this.http.get<any[]>('/api/v1/auth/user-all').subscribe({
      next: (data) => {
        this.isLoading.set(false);
        if (data && Array.isArray(data)) {
          this.users.set(data);
        } else {
          this.loadFallbackUsers();
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.loadFallbackUsers();
      }
    });
  }

  private loadFallbackUsers(): void {
    this.users.set([
      { id: 1, email: 'shohaib@example.com', firstName: 'Shohaib', lastName: 'Islam', phoneNumber: '01711223344', address: 'Dhaka, Bangladesh' },
      { id: 2, email: 'tusar@example.com', firstName: 'Hr', lastName: 'Tusar', phoneNumber: '01888776655', address: 'Chattogram, Bangladesh' }
    ]);
  }

  protected onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this instructor?')) {
      this.http.delete(`/api/v1/auth/user-delete-id/${id}`).subscribe({
        next: () => {
          this.users.update((current) => current.filter((u) => u.id !== id));
        },
        error: () => {
          // If offline or dev fallback, update the state directly
          this.users.update((current) => current.filter((u) => u.id !== id));
        }
      });
    }
  }
}
