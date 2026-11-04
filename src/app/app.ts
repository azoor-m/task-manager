import { Component, OnInit, inject, signal } from '@angular/core';
import { Task, TaskService, TaskStatus } from './task.service';
import { LoginComponent } from './login/login.component';
import { TaskListComponent } from './task/task-list.component';

@Component({
  imports: [LoginComponent, TaskListComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly tasksApi = inject(TaskService);
  protected readonly tasks = signal<Task[]>([]);
  protected readonly loading = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal('');
  protected readonly token = signal(this.tasksApi.hasToken());
  protected statusFilter: TaskStatus | '' = '';

  ngOnInit(): void {
    if (this.token()) this.loadTasks();
  }

  protected login(credentials: { username: string; password: string }): void {
    this.error.set('');
    this.submitting.set(true);
    this.tasksApi.login(credentials.username, credentials.password).subscribe({
      next: () => {
        this.token.set(true);
        this.submitting.set(false);
        this.loadTasks();
      },
      error: (error: unknown) => {
        this.error.set(this.tasksApi.errorMessage(error));
        this.submitting.set(false);
      },
    });
  }

  protected logout(): void {
    this.tasksApi.logout();
    this.token.set(false);
    this.tasks.set([]);
    this.error.set('');
  }

  protected setStatusFilter(status: TaskStatus | ''): void {
    this.statusFilter = status;
    this.loadTasks();
  }

  protected loadTasks(): void {
    this.loading.set(true);
    this.error.set('');
    this.tasksApi.getTasks(this.statusFilter).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(this.tasksApi.errorMessage(error));
        this.loading.set(false);
      },
    });
  }

  protected advance(task: Task): void {
    this.error.set('');
    this.tasksApi.advance(task.id).subscribe({
      next: () => this.loadTasks(),
      error: (error: unknown) => this.error.set(this.tasksApi.errorMessage(error)),
    });
  }

}
