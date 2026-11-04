import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  assignee?: string | null;
  status: TaskStatus;
  dueDate: string;
}

interface TaskPage {
  content: Task[];
}

interface TokenResponse {
  accessToken: string;
}

interface ApiError {
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api';
  private readonly tokenKey = 'task-manager-access-token';

  hasToken(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(this.tokenKey);
  }

  login(username: string, password: string): Observable<void> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap(({ accessToken }) => sessionStorage.setItem(this.tokenKey, accessToken)),
      map(() => undefined),
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  getTasks(status: TaskStatus | ''): Observable<Task[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<TaskPage>(`${this.apiUrl}/tasks`, { params }).pipe(map((page) => page.content));
  }

  advance(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${id}/status`, {});
  }

  errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = (error.error as ApiError | null)?.message;
      return apiMessage || (error.status === 0 ? 'Could not reach the task service. Check your connection and try again.' : `Request failed (${error.status}).`);
    }
    return 'Something went wrong. Please try again.';
  }
}
